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

    const remotes = await git.getRemotes(false);
    await git.checkout(TUTURE_BRANCH);

    try {
      const { files } = await git.pull(remotes[0].name, TUTURE_BRANCH);

      if (files.length > 0) {
        // Commit changes to tuture branch.
        logger.log('success', 'Pulled to local.');
      } else {
        logger.log('success', 'Already up-to-date.');
      }
    } catch (err) {
      logger.log('error', err.message);
      this.exit(1);
    }
  }
}
