import chalk from 'chalk';
import http from 'http';
import { flags } from '@oclif/command';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { Step } from '../types';
import { git } from '../utils/git';
import { makeSteps, mergeSteps, isInitialized } from '../utils';
import {
  loadTuture,
  saveTuture,
  saveCheckpoint,
  hasTutureChangedSinceCheckpoint,
  initializeTutureBranch,
} from '../utils/tuture';
import { TUTURE_BRANCH } from '../constants';
import { hasAssetsChangedSinceCheckpoint } from '../utils/assets';

export default class Reload extends BaseCommand {
  static description = 'Sync tuture files with current repo';

  static flags = {
    help: flags.help({ char: 'h' }),
    contextLines: flags.integer({
      description: 'number of context lines for showing git diff',
    }),
  };

  // Notify server to reload.
  async notifyServer() {
    const url = `http://localhost:${this.userConfig.port}/reload`;
    return new Promise((resolve, _) => {
      http
        .get(url, (res) => {
          const { statusCode } = res;
          if (statusCode === 200) {
            logger.log('success', 'Server is ready to reload.');
          }
          resolve();
        })
        .on('error', () => {
          resolve();
        });
    });
  }

  async run() {
    const { flags } = this.parse(Reload);

    if (!(await isInitialized())) {
      logger.log(
        'error',
        `Tuture is not initialized. Run ${chalk.bold(
          'tuture init',
        )} to initialize.`,
      );
      this.exit(1);
    }

    if (
      hasTutureChangedSinceCheckpoint() ||
      hasAssetsChangedSinceCheckpoint()
    ) {
      logger.log(
        'error',
        'You have uncommitted changes. Commit them with tuture commit.',
      );
      this.exit(1);
    }

    await initializeTutureBranch();

    // Trying to update tuture branch.
    await git.checkout(TUTURE_BRANCH);

    try {
      await git.merge(['master']);
    } catch {
      logger.log('warning', 'master branch is empty.');
    }

    const tuture = await loadTuture(true);

    const currentSteps: Step[] = await makeSteps(
      this.userConfig.ignoredFiles,
      flags.contextLines,
    );
    tuture.steps = mergeSteps(tuture.steps, currentSteps);

    saveTuture(tuture);
    await this.notifyServer();

    // Copy the last committed file.
    await saveCheckpoint();

    logger.log('success', 'Reload complete!');
  }
}
