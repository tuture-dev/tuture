import chalk from 'chalk';
import fs from 'fs-extra';
import { flags } from '@oclif/command';
import { TUTURE_BRANCH } from '@tuture/core';
import { collectionPath } from '@tuture/local-server';

import BaseCommand from '../base';
import { checkInitStatus } from '../utils';
import logger from '../utils/logger';
import { git } from '../utils/git';
import { initializeTutureBranch } from '../utils/collection';

export default class Push extends BaseCommand {
  static description = 'Push the tuture branch to remote';

  static flags = {
    help: flags.help({ char: 'h' }),
    remote: flags.string({ char: 'r', description: 'name of remote to push' }),
  };

  async run() {
    const { flags } = this.parse(Push);
    this.userConfig = Object.assign(this.userConfig, flags);

    try {
      await checkInitStatus();
    } catch (err) {
      logger.log('error', err.message);
      this.exit(1);
    }

    let remoteToPush = flags.remote;
    if (!remoteToPush) {
      const remotes = await git.getRemotes(true);

      if (remotes.length === 0) {
        logger.log('error', 'Remote repository has not been configured.');
        this.exit(1);
      } else {
        // Select the first remote by default.
        remoteToPush = remotes[0].name;
      }
    }

    await initializeTutureBranch();

    try {
      // Checkout tuture branch and add tuture.yml.
      await git.checkout(TUTURE_BRANCH);

      if (!fs.existsSync(collectionPath)) {
        logger.log(
          'error',
          `Cannot push empty tuture branch. Please commit your tutorial with ${chalk.bold(
            'tuture commit',
          )}.`,
        );
        this.exit(1);
      }

      logger.log('info', `Starting to push to ${remoteToPush}.`);

      await git.push(remoteToPush, TUTURE_BRANCH);
      logger.log('success', `Pushed to ${remoteToPush} successfully.`);
    } catch (err) {
      logger.log('error', String(err.message).trim());
    }
  }
}
