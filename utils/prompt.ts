import crypto from 'crypto';
import { prompt } from 'inquirer';

import { Meta } from '../types';

type ConfirmResponse = {
  answer: boolean;
};

export async function promptConfirm(message: string) {
  return await prompt<ConfirmResponse>([
    {
      message,
      type: 'confirm',
      name: 'answer',
      default: false,
    },
  ]);
}

export async function promptMetaData(yes: boolean) {
  const answer: any = yes
    ? { name: 'My Awesome Tutorial' }
    : await prompt([
        {
          name: 'name',
          message: 'Tutorial Name',
          default: 'My Awesome Tutorial',
        },
        {
          name: 'description',
          message: 'Description',
        },
        {
          name: 'topics',
          message: 'Topics',
        },
        {
          name: 'categories',
          message: 'Categories',
        },
      ]);
  answer.id = crypto.randomBytes(16).toString('hex');

  // TODO: process user input with inquirer built-ins
  const { topics, categories } = answer;
  if (topics) {
    answer.topics = topics.split(/\W+/);
  } else {
    delete answer.topics;
  }

  if (categories) {
    answer.categories = categories.split(/\W+/);
  } else {
    delete answer.categories;
  }

  return answer as Meta;
}
