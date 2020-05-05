import fs from 'fs-extra';
import { flags } from '@oclif/command';
import { Step, getStepTitle } from '@tuture/core';
import {
  loadCollection,
  collectionPath,
  saveCollection,
} from '@tuture/local-server';

import sync from './sync';
import BaseCommand from '../base';
import { git } from '../utils/git';
import logger from '../utils/logger';
import { makeSteps, mergeSteps } from '../utils';

export default class Reload extends BaseCommand {
  static description = 'Update workspace with latest commit history';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Reload);

    // Run sync command if workspace is not created.
    if (!fs.existsSync(collectionPath)) {
      await sync.run([]);
    }

    const collection = loadCollection();

    // Checkout master branch and add tuture.yml.
    await git.checkout('master');

    const currentSteps: Step[] = await makeSteps(this.userConfig.ignoredFiles);
    const lastArticleId = collection.articles.slice(-1)[0].id;

    currentSteps.forEach((step) => {
      if (!collection.steps.map((step) => step.commit).includes(step.commit)) {
        logger.log(
          'success',
          `New step: ${getStepTitle(step)} (${step.commit})`,
        );

        // For newly added steps, assign it to the last article.
        step.articleId = lastArticleId;
      }
    });

    collection.steps = mergeSteps(collection.steps, currentSteps);

    collection.steps.forEach((step) => {
      if (step.outdated) {
        logger.log(
          'warning',
          `Outdated step: ${getStepTitle(step)} (${step.commit})`,
        );
      }
    });

    saveCollection(collection);

    logger.log('success', 'Reload complete!');
  }
}
