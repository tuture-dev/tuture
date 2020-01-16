import http from 'http';
import { flags } from '@oclif/command';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { Step } from '../types';
import { makeSteps, mergeSteps } from '../utils';
import { loadTuture, saveTuture } from '../utils/tuture';

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

    const tuture = await loadTuture();
    const currentSteps: Step[] = await makeSteps(
      this.userConfig.ignoredFiles,
      flags.contextLines,
    );
    tuture.steps = mergeSteps(tuture.steps, currentSteps);

    saveTuture(tuture);
    await this.notifyServer();

    logger.log('success', 'Reload complete!');
  }
}
