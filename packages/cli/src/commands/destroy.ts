import { flags } from '@oclif/command';
import { prompt } from 'inquirer';
import { TUTURE_BRANCH } from '@tuture/core';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { git } from '../utils/git';
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

    if (!flags.force) {
      await this.promptConfirmDestroy();
    }

    await removeTutureSuite();

    // Remove local tuture branch if exists.
    const { all: allBranches } = await git.branchLocal();
    if (allBranches.includes(TUTURE_BRANCH)) {
      await git.branch(['-D', TUTURE_BRANCH]);
      logger.log('success', 'Deleted tuture branch.');
    }

    logger.log('success', 'Tuture tutorial has been destroyed!');
  }
}
