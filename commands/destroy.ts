import fs from 'fs-extra';
import { flags } from '@oclif/command';
import { prompt } from 'inquirer';

import BaseCommand from '../base';
import logger from '../utils/logger';
import * as git from '../utils/git';
import { TUTURE_YML_PATH } from '../config';
import { removeTutureSuite } from '../utils';

type ConfirmResponse = {
  answer: boolean;
};

export default class Destroy extends BaseCommand {
  static description = 'Delete all tuture files';

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({
      char: 'f',
      description: 'destroy without confirmation',
    }),
  };

  async promptConfirmDestroy() {
    const response = await prompt([
      {
        type: 'confirm',
        name: 'answer',
        message: 'Are you sure?',
        default: false,
      },
    ]);
    if (!(response as ConfirmResponse).answer) {
      this.exit(0);
    }
  }

  async run() {
    const { flags } = this.parse(Destroy);

    if (!fs.existsSync(TUTURE_YML_PATH)) {
      logger.log('error', 'No Tuture tutorial to destroy!');
      this.exit(1);
    }

    if (!flags.force) {
      await this.promptConfirmDestroy();
    }

    git.removeGitHook();
    await removeTutureSuite();

    logger.log('success', 'Tuture tutorial has been destroyed!');
  }
}
