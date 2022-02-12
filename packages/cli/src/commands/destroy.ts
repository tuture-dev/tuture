import { Command } from 'commander';
import inquirer from 'inquirer';
import debug from 'debug';

import logger from '../utils/logger.js';

const { prompt } = inquirer;
const d = debug('tuture:cli:destroy');

async function promptConfirm(message: string, defaultChoice = false) {
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

type DestroyOptions = {
  force: boolean;
};

async function doDestroy(options: DestroyOptions) {
  d('options: %o', options);

  if (!options.force) {
    const confirmed = await promptConfirm('Are you sure?');
    d('confirmed: %o', confirmed);
    if (!confirmed) {
      return;
    }
  }

  logger.log('success', 'Tutorial has been destroyed!');
}

export function makeDestroyCommand() {
  const destroy = new Command('destroy');

  destroy
    .description('delete current tutorial')
    .option('-f, --force', 'destroy without confirmation')
    .action(async () => {
      await doDestroy(destroy.opts<DestroyOptions>());
    });

  return destroy;
}
