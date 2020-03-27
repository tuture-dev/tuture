import chalk from 'chalk';
import { flags } from '@oclif/command';

import BaseCommand from '../base';
import { checkInitStatus } from '../utils';
import logger from '../utils/logger';
import { git } from '../utils/git';
import { TUTURE_BRANCH } from '../constants';

export default class Pull extends BaseCommand {
  static description = 'Pull the remote tuture branch to local';

  static flags = {
    help: flags.help({ char: 'h' }),
    remote: flags.string({ char: 'r', description: 'name of remote to pull' }),
  };

  async run() {
    const { flags } = this.parse(Pull);
    this.userConfig = Object.assign(this.userConfig, flags);

    try {
      await checkInitStatus();
    } catch (err) {
      logger.log('error', err.message);
      this.exit(1);
    }

    let remoteToPull = flags.remote;
    if (!remoteToPull) {
      const remotes = await git.getRemotes(true);

      if (remotes.length === 0) {
        logger.log('error', 'Remote repository has not been configured.');
        this.exit(1);
      } else {
        // Select the first remote by default.
        remoteToPull = remotes[0].name;
      }
    }

    try {
      await git.checkout(TUTURE_BRANCH);

      logger.log('info', `Starting to pull from ${remoteToPull}.`);
      const { files } = await git.pull(remoteToPull, TUTURE_BRANCH);

      if (files.length > 0) {
        // Commit changes to tuture branch.
        logger.log('success', `Pulled from ${remoteToPull} successfully.`);
      } else {
        logger.log('success', `Already up-to-date with ${remoteToPull}.`);
      }
    } catch (err) {
      const { conflicted } = await git.status();
      if (conflicted.length > 0) {
        logger.log(
          'error',
          `Please manually resolve the conflict and run ${chalk.bold(
            'tuture sync --continue',
          )} to move on.`,
        );
      } else {
        // No remote tuture branch.
        logger.log('error', String(err.message).trim());
      }

      this.exit(1);
    }
  }
}
