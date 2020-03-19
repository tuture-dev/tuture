import chalk from 'chalk';
import fs from 'fs-extra';
import { flags } from '@oclif/command';

import BaseCommand from '../base';
import { checkInitStatus } from '../utils';
import logger from '../utils/logger';
import { git } from '../utils/git';
import { initializeTutureBranch, collectionPath } from '../utils/collection';
import { TUTURE_BRANCH } from '../constants';

export default class Push extends BaseCommand {
  static description = 'Push the tuture branch to remote';

  static flags = {
    help: flags.help({ char: 'h' }),
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

    await initializeTutureBranch();

    const remotes = await git.getRemotes(false);

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

    try {
      await git.push(remotes[0].name, TUTURE_BRANCH);
      logger.log('success', 'Pushed to remote.');
    } catch (err) {
      logger.log('error', err.message);
    }
  }
}
