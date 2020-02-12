import { flags } from '@oclif/command';

import reload from './reload';
import BaseCommand from '../base';
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

    const remotes = await git.getRemotes(false);
    await git.checkout(TUTURE_BRANCH);
    await git.pull(remotes[0].name, TUTURE_BRANCH);

    // Commit changes to tuture branch.
    logger.log('success', 'Pulled to local.');

    await reload.run([]);
  }
}
