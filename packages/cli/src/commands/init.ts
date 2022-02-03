import chalk from 'chalk';
import debug from 'debug';
import inquirer from 'inquirer';
import { Command } from 'commander';
import { Collection, SCHEMA_VERSION, randHex } from '@tuture/core';
import {
  saveDoc,
  saveCollection,
  saveToInventory,
  getInventoryItemByPath,
} from '@tuture/local-server';

import logger from '../utils/logger.js';
import { initNodes } from '../utils/index.js';
import { git, inferGithubField } from '../utils/git.js';

const { prompt } = inquirer;
const d = debug('tuture:cli:init');

async function promptInitGit(yes: boolean) {
  const response = yes
    ? { answer: true }
    : await prompt<{
        answer: boolean;
      }>([
        {
          name: 'answer',
          type: 'confirm',
          message:
            'You are not in a Git repository, do you want to initialize one?',
          default: false,
        },
      ]);

  if (!response.answer) {
    return;
  }

  await git.init();
  logger.log('success', 'Git repository is initialized!');
}

async function promptMetaData(yes: boolean) {
  const answer = yes
    ? { name: 'My Awesome Tutorial' }
    : await prompt<{ name: string; description: string }>([
        {
          name: 'name',
          message: 'Collection Name',
          default: 'My Awesome Tutorial',
        },
        {
          name: 'description',
          message: 'Description',
        },
      ]);

  return answer;
}

type InitOptions = {
  yes: boolean;
};

async function doInit(options: InitOptions) {
  d('cwd: %s', process.cwd());
  d('options: %o', options);

  const item = await getInventoryItemByPath(process.cwd());
  d('inventory item: %o', item);
  if (item) {
    logger.log('success', 'Tuture tutorial has already been initialized!');
    return;
  }

  if (!(await git.checkIsRepo())) {
    await promptInitGit(options.yes);
  }

  const meta = await promptMetaData(options.yes);
  d('meta: %o', meta);

  const defaultArticleId = randHex(32);
  const nodes = await initNodes();

  await saveDoc({
    type: 'doc',
    content: nodes,
    attrs: { id: defaultArticleId },
  });

  const collection: Collection = {
    ...meta,
    id: randHex(32),
    created: new Date(),
    articles: [
      {
        id: defaultArticleId,
        name: meta.name,
        description: '',
        topics: [],
        categories: [],
        created: new Date(),
        cover: '',
      },
    ],
  };

  const github = await inferGithubField();
  if (github) {
    logger.log(
      'info',
      `Inferred github repository: ${chalk.underline(
        github,
      )}. Feel free to revise or delete it.`,
    );
    collection.github = github;
  }

  collection.version = SCHEMA_VERSION;
  d('init collection: %O', collection);

  await saveToInventory(process.cwd(), collection);
  await saveCollection(collection);

  logger.log('success', 'Tuture tutorial has been initialized!');
}

export function makeInitCommand() {
  const init = new Command('init');

  init
    .description('initialize a tutorial from current repository')
    .option('-y, --yes', 'do not ask for prompts')
    .action(async () => {
      await doInit(init.opts<InitOptions>());
    });

  return init;
}
