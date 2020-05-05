import { flags } from '@oclif/command';
import { prompt } from 'inquirer';
import { TUTURE_BRANCH } from '@tuture/core';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { git } from '../utils/git';
import { removeTutureSuite } from '../utils';

export default class Destroy extends BaseCommand {
  static description = 'Delete all tuture files';

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({
      char: 'f',
      description: 'destroy without confirmation',
    }),
  };

  async promptConfirm(message: string, defaultChoice = false) {
    const response = await prompt<{ answer: boolean }>([
      {
        type: 'confirm',
        name: 'answer',
        message,
        default: defaultChoice,
      },
    ]);

    return response.answer;
  }

  async run() {
    const { flags } = this.parse(Destroy);

    if (!flags.force) {
      const confirmed = await this.promptConfirm('Are you sure?');
      if (!confirmed) {
        this.exit(0);
      }
    }

    await removeTutureSuite();

    const { all: allBranches } = await git.branch({ '-a': true });

    // Remove local tuture branch if exists.
    if (allBranches.includes(TUTURE_BRANCH)) {
      await git.branch(['-D', TUTURE_BRANCH]);
      logger.log('success', 'Local tuture branch has been deleted.');
    }

    const remoteBranches = allBranches.filter(
      (branch) => branch.indexOf(TUTURE_BRANCH) > 0,
    );

    if (remoteBranches.length > 0) {
      const confirmed = await this.promptConfirm(
        `Do you want to delete ${remoteBranches.length} remote tuture branch(es)?`,
      );

      if (confirmed) {
        // Delete all remote branches.
        await Promise.all(
          remoteBranches.map(async (branch) => {
            const [_, remote, ref] = branch.split('/');
            await git.push(remote, ref, { '-d': true });
            logger.log('success', `${branch} has been deleted.`);
          }),
        );
      }
    }

    logger.log('success', 'Tuture tutorial has been destroyed!');
  }
}
