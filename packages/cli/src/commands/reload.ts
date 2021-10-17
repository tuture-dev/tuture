import fs from 'fs-extra';
import { flags } from '@oclif/command';
import { includeCommit } from '@tuture/core';
import {
  collectionPath,
  loadCollection,
  saveCollection,
  loadStepSync,
  saveStepSync,
} from '@tuture/local-server';

import sync from './sync';
import BaseCommand from '../base';
import { git } from '../utils/git';
import logger from '../utils/logger';
import { initSteps } from '../utils';

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
    const assignedSteps = collection.articles.flatMap(
      (article) => article.steps,
    );
    const unassignedSteps = collection.unassignedSteps;
    const collectionSteps = assignedSteps.concat(unassignedSteps);
    const collectionCommits = collectionSteps.map((step) => step.commit);

    await git.checkout('master');

    const ignoredFiles: string[] = this.userConfig.ignoredFiles;
    const currentSteps = await initSteps('', ignoredFiles);
    const currentCommits = currentSteps.map((step) => step.attrs.commit);

    // Mark outdated nodes whose commit no longer exists
    collectionSteps.forEach((step) => {
      if (!includeCommit(currentCommits, step.commit)) {
        const outdatedStep = loadStepSync(step.id);
        const { name, commit } = outdatedStep.attrs;
        outdatedStep.attrs.outdated = true;
        saveStepSync(step.id, outdatedStep);
        logger.log('warning', `Outdated step: ${name} (${commit})`);
      }
    });

    // Add new nodes to last article
    const lastArticle = collection.articles[collection.articles.length - 1];
    const newSteps = currentSteps.filter(
      (step) => !includeCommit(collectionCommits, step.attrs.commit),
    );
    newSteps.forEach((step) => {
      step.attrs.articleId = lastArticle.id;
      saveStepSync(step.attrs.stepId, step);

      lastArticle.steps.push({
        id: step.attrs.stepId,
        commit: step.attrs.commit,
      });
    });

    // TODO: clean out ignored files, set display to false for those nodes.

    saveCollection(collection);

    logger.log('success', 'Reload complete!');
  }
}
