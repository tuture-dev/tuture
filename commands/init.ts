import crypto from 'crypto';
import chalk from 'chalk';
import fs from 'fs-extra';
import { flags } from '@oclif/command';
import { prompt } from 'inquirer';

import logger from '../utils/logger';
import BaseCommand from '../base';
import { Collection, Meta } from '../types';
import { makeSteps, removeTutureSuite } from '../utils';
import { saveCollection } from '../utils/collection';
import { git, inferGithubField, appendGitignore } from '../utils/git';
import { COLLECTION_PATH } from '../constants';

type ConfirmResponse = {
  answer: boolean;
};

export default class Init extends BaseCommand {
  static description = 'Initialize a tuture tutorial';

  static flags = {
    help: flags.help({ char: 'h' }),
    yes: flags.boolean({
      char: 'y',
      description: 'do not ask for prompts',
    }),
    contextLines: flags.integer({
      description: 'number of context lines for showing git diff',
    }),
  };

  async promptInitGit(yes: boolean) {
    const response = yes
      ? { answer: true }
      : await prompt([
          {
            name: 'answer',
            type: 'confirm',
            message:
              'You are not in a Git repository, do you want to initialize one?',
            default: false,
          },
        ]);

    if (!(response as ConfirmResponse).answer) {
      this.exit(0);
    } else {
      await git.init();
      logger.log('success', 'Git repository is initialized!');
    }
  }

  async promptMetaData(yes: boolean): Promise<Meta> {
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

  async run() {
    const { flags } = this.parse(Init);

    if (fs.existsSync(COLLECTION_PATH)) {
      logger.log('success', 'Tuture tutorial has already been initialized!');
      this.exit(0);
    }

    if (!fs.existsSync('.git')) {
      await this.promptInitGit(flags.yes);
    }

    const meta = await this.promptMetaData(flags.yes);
    const steps = await makeSteps(
      this.userConfig.ignoredFiles,
      flags.contextLines,
    );

    try {
      const collection: Collection = {
        ...meta,
        created: new Date(),
        articles: [
          {
            ...meta,
            commits: steps.map((step) => step.commit),
          },
        ],
        steps,
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

      saveCollection(collection);
      appendGitignore(this.userConfig);

      logger.log('success', 'Tuture tutorial has been initialized!');
    } catch (err) {
      await removeTutureSuite();
      logger.log({
        level: 'error',
        message: err.message,
        error: err,
      });
      this.exit(1);
    }
  }
}
