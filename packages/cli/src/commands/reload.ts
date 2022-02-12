import fs from 'fs-extra';
import { Command } from 'commander';
import { loadCollection, saveCollection } from '@tuture/local-server';
import { includeCommit } from '@tuture/core';

import { initNodes } from '../utils';
import logger from '../utils/logger.js';

async function doReload() {
  // // Run sync command if workspace is not created.
  // if (!fs.existsSync(collectionPath)) {
  //   await sync.run([]);
  // }

  // const collection = loadCollection();
  // const assignedSteps = collection.articles.flatMap(
  //   (article) => article.steps,
  // );
  // const unassignedSteps = collection.unassignedSteps;
  // const collectionSteps = assignedSteps.concat(unassignedSteps);
  // const collectionCommits = collectionSteps.map((step) => step.commit);

  // await git.checkout('master');

  // const ignoredFiles: string[] = this.userConfig.ignoredFiles;
  // const currentSteps = await initNodes(ignoredFiles);
  // const currentCommits = currentSteps.map((step) => step.attrs.commit);

  // // Mark outdated nodes whose commit no longer exists
  // collectionSteps.forEach((step) => {
  //   if (!includeCommit(currentCommits, step.commit)) {
  //     const outdatedStep = loadStepSync(step.id);
  //     const { name, commit } = outdatedStep.attrs;
  //     outdatedStep.attrs.outdated = true;
  //     saveStepSync(step.id, outdatedStep);
  //     logger.log('warning', `Outdated step: ${name} (${commit})`);
  //   }
  // });

  // // Add new nodes to last article
  // const lastArticle = collection.articles[collection.articles.length - 1];
  // const newSteps = currentSteps.filter(
  //   (step) => !includeCommit(collectionCommits, step.attrs.commit),
  // );
  // newSteps.forEach((step) => {
  //   step.attrs.articleId = lastArticle.id;

  //   lastArticle.steps.push({
  //     id: step.attrs.id,
  //     commit: step.attrs.commit,
  //   });
  // });

  // TODO: clean out ignored files, set display to false for those nodes.

  // saveCollection(collection);

  logger.log('success', 'Reload complete!');
}

export function makeReloadCommand() {
  const reload = new Command('reload');
  reload
    .description('update workspace with latest git history')
    .option('-y, --yes', 'do not ask for prompts')
    .action(async () => {});

  return reload;
}
