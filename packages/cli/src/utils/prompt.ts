import crypto from 'crypto';
import chalk from 'chalk';
import { prompt } from 'inquirer';
import { Meta, Remote } from '@tuture/core';

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

export async function selectRemotes(remotes: Remote[], selected?: Remote[]) {
  // All remotes are shown as:
  // <remote_name> (fetch: <fetch_ref>, push: <push_ref>)
  const remoteToChoice = (remote: Remote) => {
    const { name, refs } = remote;
    const { fetch, push } = refs;
    const { underline } = chalk;

    return `${name} (fetch: ${underline(fetch)}, push: ${underline(push)})`;
  };

  const choiceToRemote = (choice: string) => {
    const selectedRemote = choice.slice(0, choice.indexOf('(') - 1);
    return remotes.filter((remote) => remote.name === selectedRemote)[0];
  };

  const response = await prompt<{ remotes: string[] }>([
    {
      name: 'remotes',
      type: 'checkbox',
      message: 'Select remote repositories you want to sync to:',
      choices: remotes.map((remote) => remoteToChoice(remote)),
      default: (selected || []).map((remote) => remoteToChoice(remote)),
    },
  ]);

  return response.remotes.map((choice) => choiceToRemote(choice));
}
