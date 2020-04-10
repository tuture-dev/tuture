import cp from 'child_process';
import fs from 'fs-extra';
import { flags } from '@oclif/command';
import { prompt } from 'inquirer';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { git } from '../utils/git';
import {
  collectionPath,
  collectionVcsPath,
  saveCheckpoint,
  collectionCheckpoint,
  initializeTutureBranch,
} from '../utils/collection';
import { TUTURE_BRANCH, COLLECTION_PATH, ASSETS_JSON_PATH } from '../constants';

export default class Commit extends BaseCommand {
  static description = 'Commit your tutorial to VCS (Git)';

  static flags = {
    help: flags.help({ char: 'h' }),
    message: flags.string({
      char: 'm',
      description: 'commit message',
    }),
  };

  async run() {
    const { flags } = this.parse(Commit);
    this.userConfig = Object.assign(this.userConfig, flags);

    const message =
      flags.message ||
      ((await prompt([
        {
          name: 'message',
          type: 'input',
          default: `Commit on ${new Date()}`,
        },
      ])) as any).message;

    await initializeTutureBranch();

    // Checkout tuture branch and add tuture.yml.
    await git.checkout(TUTURE_BRANCH);

    // Trying to copy and add collection data to staging.
    fs.copySync(collectionPath, collectionVcsPath);
    await git.add(collectionVcsPath);

    // COMPAT: remove collection.json and tuture-assets.json from project root.
    if (fs.existsSync(COLLECTION_PATH)) {
      await git.rm(COLLECTION_PATH);
    }
    if (fs.existsSync(ASSETS_JSON_PATH)) {
      await git.rm(ASSETS_JSON_PATH);
    }

    fs.removeSync(collectionCheckpoint);

    // Commit changes to tuture branch.
    cp.execSync(`git commit --allow-empty -m "tuture: ${message}"`);
    logger.log('success', `Committed to branch ${TUTURE_BRANCH} (${message})`);

    // Copy the last committed file.
    await saveCheckpoint();
  }
}
