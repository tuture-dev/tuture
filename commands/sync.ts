import chalk from 'chalk';
import fs from 'fs-extra';
import { flags } from '@oclif/command';

import commit from './commit';
import pull from './pull';
import push from './push';
import BaseCommand from '../base';
import { checkInitStatus } from '../utils';
import { git } from '../utils/git';
import logger from '../utils/logger';
import {
  collectionPath,
  saveCheckpoint,
  initializeTutureBranch,
  hasRemoteTutureBranch,
  hasTutureChangedSinceCheckpoint,
} from '../utils/collection';
import { COLLECTION_PATH, TUTURE_BRANCH, ASSETS_JSON_PATH } from '../constants';
import {
  syncImages,
  assetsTablePath,
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
  };

  copyFilesFromTutureBranch() {
    fs.copySync(COLLECTION_PATH, collectionPath);
    if (fs.existsSync(ASSETS_JSON_PATH)) {
      fs.copySync(ASSETS_JSON_PATH, assetsTablePath);
    }

    saveCheckpoint();
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

    if (!fs.existsSync(collectionPath)) {
      await initializeTutureBranch();
      await git.checkout(TUTURE_BRANCH);

      if (!fs.existsSync(COLLECTION_PATH)) {
        logger.log(
          'error',
          `Cannot load tuture. Please run ${chalk.bold(
            'tuture init',
          )} to initialize.`,
        );

        this.exit(1);
      }

      this.copyFilesFromTutureBranch();

      // Download assets from image hosting.
      syncImages();

      logger.log('success', 'Workspace created from remote tuture branch!');
    } else {
      // Step 1: run `commit` command if something has changed.
      if (
        hasTutureChangedSinceCheckpoint() ||
        hasAssetsChangedSinceCheckpoint()
      ) {
        const message = flags.message || `Commit on ${new Date()}`;
        await commit.run(['-m', message]);
      }

      // Step 2: run `pull` command
      if (!flags.noPull && (await hasRemoteTutureBranch())) {
        logger.log('info', 'Starting to pull from remote.');
        await pull.run([]);
      }

      // Step 3: run `push` command
      if (!flags.noPush) {
        logger.log('info', 'Starting to push to remote.');
        await push.run([]);
      }

      await git.checkout(TUTURE_BRANCH);
      this.copyFilesFromTutureBranch();

      // Download assets if necessary.
      syncImages();

      logger.log('success', 'Synchronization complete!');
    }
  }
}
