import chalk from 'chalk';
import http from 'http';
import { flags } from '@oclif/command';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { Step } from '../types';
import { makeSteps, mergeSteps, checkInitStatus } from '../utils';
import { git } from '../utils/git';
import {
  loadCollection,
  saveCollection,
  saveCheckpoint,
  hasTutureChangedSinceCheckpoint,
} from '../utils/collection';
import { hasAssetsChangedSinceCheckpoint, syncImages } from '../utils/assets';

export default class Reload extends BaseCommand {
  static description = 'Sync tuture files with current repo';

  static flags = {
    help: flags.help({ char: 'h' }),
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
    this.parse(Reload);

    try {
      await checkInitStatus();
    } catch (err) {
      logger.log('error', err.message);
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

    try {
      const collection = await loadCollection(true);

      // Checkout master branch and add tuture.yml.
      await git.checkout('master');

      const currentSteps: Step[] = await makeSteps(
        this.userConfig.ignoredFiles,
      );
      const lastArticleId = collection.articles.slice(-1)[0].id;

      currentSteps.forEach((step) => {
        // For newly added steps, assign it to the last article.
        if (!collection.steps.map((step) => step.id).includes(step.id)) {
          step.articleId = lastArticleId;
        }
      });

      collection.steps = mergeSteps(collection.steps, currentSteps);

      saveCollection(collection);

      // Download assets if necessary.
      syncImages();

      // Copy the last committed file.
      await saveCheckpoint();

      logger.log('success', 'Reload complete!');
    } catch (err) {
      logger.log('error', err.message);
      this.exit(1);
    }
  }
}
