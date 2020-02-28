import chalk from 'chalk';
import http from 'http';
import { flags } from '@oclif/command';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { Step } from '../types';
import { makeSteps, mergeSteps, isInitialized } from '../utils';
import {
  loadCollection,
  saveCollection,
  saveCheckpoint,
  hasTutureChangedSinceCheckpoint,
} from '../utils/collection';
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

    const collection = await loadCollection(true);

    const currentSteps: Step[] = await makeSteps(
      this.userConfig.ignoredFiles,
      flags.contextLines,
    );
    collection.steps = mergeSteps(collection.steps, currentSteps);

    const lastArticleId = collection.articles.slice(-1)[0].id;
    for (const step of collection.steps.reverse()) {
      if (!step.articleId) {
        step.articleId = lastArticleId;
      } else {
        break;
      }
    }

    saveCollection(collection);
    await this.notifyServer();

    // Copy the last committed file.
    await saveCheckpoint();

    logger.log('success', 'Reload complete!');
  }
}
