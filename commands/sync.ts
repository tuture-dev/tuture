import chalk from 'chalk';
import fs from 'fs-extra';
import { flags } from '@oclif/command';

import commit from './commit';
import pull from './pull';
import push from './push';
import BaseCommand from '../base';
import { Remote } from '../types';
import { checkInitStatus } from '../utils';
import { git, selectRemotes } from '../utils/git';
import logger from '../utils/logger';
import {
  collectionPath,
  collectionVcsPath,
  saveCheckpoint,
  loadCollection,
  saveCollection,
  initializeTutureBranch,
  hasRemoteTutureBranch,
  hasCollectionChangedSinceCheckpoint,
} from '../utils/collection';
import { COLLECTION_PATH, TUTURE_BRANCH, ASSETS_JSON_PATH } from '../constants';
import {
  syncImages,
  assetsTablePath,
  assetsTableVcsPath,
  hasAssetsChangedSinceCheckpoint,
} from '../utils/assets';

export default class Sync extends BaseCommand {
  static description = 'Synchronize workspace with local/remote branch';

  static flags = {
    help: flags.help({ char: 'h' }),
    message: flags.string({
      char: 'm',
      description: 'commit message',
    }),
    noPull: flags.boolean({
      description: 'do not pull from remote',
      default: false,
    }),
    noPush: flags.boolean({
      description: 'do not push to remote',
      default: false,
    }),
    configureRemotes: flags.boolean({
      description: 'configure remotes before synchronization',
      default: false,
    }),
    continue: flags.boolean({
      description: 'continue synchronization after resolving conflicts',
      default: false,
    }),
  };

  async copyFilesFromTutureBranch() {
    await git.checkout(TUTURE_BRANCH);

    // COMPAT: copy files from project root for older alpha versions.
    if (fs.existsSync(COLLECTION_PATH)) {
      fs.copySync(COLLECTION_PATH, collectionPath);
    }
    if (fs.existsSync(ASSETS_JSON_PATH)) {
      fs.copySync(ASSETS_JSON_PATH, assetsTablePath);
    }

    if (fs.existsSync(collectionVcsPath)) {
      fs.copySync(collectionVcsPath, collectionPath);
    }
    if (fs.existsSync(assetsTableVcsPath)) {
      fs.copySync(assetsTableVcsPath, assetsTablePath);
    }

    saveCheckpoint();
  }

  async pullFromRemotes(remotes: Remote[]) {
    await Promise.all(
      remotes.map(
        ({ name }) =>
          new Promise<void>((resolve) => {
            pull.run(['-r', name.trim()]).then(() => resolve());
          }),
      ),
    );
  }

  async pushToRemotes(remotes: Remote[]) {
    await Promise.all(
      remotes.map(
        ({ name }) =>
          new Promise<void>((resolve) => {
            push.run(['-r', name.trim()]).then(() => resolve());
          }),
      ),
    );
  }

  async run() {
    const { flags } = this.parse(Sync);
    this.userConfig = Object.assign(this.userConfig, flags);

    try {
      await checkInitStatus();
    } catch (err) {
      logger.log('error', err.message);
      this.exit(1);
    }

    const { conflicted, staged } = await git.status();
    if (conflicted.length > 0) {
      logger.log(
        'error',
        `You still have unresolved conflict file(s): ${conflicted}`,
      );
      this.exit(1);
    }

    if (flags.continue) {
      if (staged.length === 0) {
        logger.log('error', `You have not staged any file. Aborting.`);
        this.exit(1);
      }

      await git.commit(`Resolve conflict during sync (${new Date()})`);
      await this.copyFilesFromTutureBranch();

      const collection = loadCollection();

      if (
        flags.configureRemotes ||
        !collection.remotes ||
        collection.remotes.length === 0
      ) {
        const remotes = await git.getRemotes(true);

        if (remotes.length === 0) {
          logger.log('error', 'Remote repository has not been configured.');
          this.exit(1);
        } else {
          collection.remotes = await selectRemotes(remotes, collection.remotes);
          saveCollection(collection);
        }
      }

      if (!flags.noPush) {
        await this.pushToRemotes(collection.remotes!);
      }

      // Download assets from image hosting.
      syncImages();

      await git.checkout('master');

      logger.log('success', 'Synchronization complete!');
      this.exit(0);
    }

    if (!fs.existsSync(collectionPath)) {
      await initializeTutureBranch();
      await git.checkout(TUTURE_BRANCH);

      // COMPAT: check both project root and vcs root.
      if (
        !fs.existsSync(COLLECTION_PATH) &&
        !fs.existsSync(collectionVcsPath)
      ) {
        logger.log(
          'error',
          `Cannot load collection data. Please run ${chalk.bold(
            'tuture init',
          )} to initialize.`,
        );

        this.exit(1);
      }

      await this.copyFilesFromTutureBranch();

      // Download assets from image hosting.
      syncImages();

      logger.log('success', 'Workspace created from remote tuture branch!');
    } else {
      const collection = loadCollection();

      if (
        flags.configureRemotes ||
        !collection.remotes ||
        collection.remotes.length === 0
      ) {
        const remotes = await git.getRemotes(true);

        if (remotes.length === 0) {
          logger.log('error', 'Remote repository has not been configured.');
          this.exit(1);
        } else {
          collection.remotes = await selectRemotes(remotes, collection.remotes);
          saveCollection(collection);
        }
      }

      // Step 1: run `commit` command if something has changed.
      if (
        hasCollectionChangedSinceCheckpoint() ||
        hasAssetsChangedSinceCheckpoint()
      ) {
        const message = flags.message || `Commit on ${new Date()}`;
        await commit.run(['-m', message]);
      }

      // Step 2: run `pull` command
      if (!flags.noPull && (await hasRemoteTutureBranch())) {
        await this.pullFromRemotes(collection.remotes!);
      }

      // Step 3: run `push` command
      if (!flags.noPush) {
        await this.pushToRemotes(collection.remotes!);
      }

      await this.copyFilesFromTutureBranch();

      // Download assets if necessary.
      syncImages();

      logger.log('success', 'Synchronization complete!');
    }
  }
}
