import fs from 'fs-extra';
import { flags } from '@oclif/command';

import sync from './sync';
import BaseCommand from '../base';
import logger from '../utils/logger';
import { Step } from '../types';
import { makeSteps, mergeSteps, checkInitStatus } from '../utils';
import { git } from '../utils/git';
import {
  loadCollection,
  collectionPath,
  saveCollection,
} from '../utils/collection';

export default class Reload extends BaseCommand {
  static description = 'Update workspace with latest commit history';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Reload);

    try {
      await checkInitStatus();
    } catch (err) {
      logger.log('error', err.message);
      this.exit(1);
    }

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
      // For newly added steps, assign it to the last article.
      if (!collection.steps.map((step) => step.id).includes(step.id)) {
        step.articleId = lastArticleId;
      }
    });

    collection.steps = mergeSteps(collection.steps, currentSteps);

    saveCollection(collection);

    logger.log('success', 'Reload complete!');
  }
}
