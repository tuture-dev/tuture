import chalk from 'chalk';
import fs from 'fs-extra';
import { flags } from '@oclif/command';
import { prompt } from 'inquirer';
import { Collection, SCHEMA_VERSION, randHex } from '@tuture/core';
import { collectionPath, saveCollection } from '@tuture/local-server';

import logger from '../utils/logger';
import BaseCommand from '../base';
import { makeSteps, removeTutureSuite, selectRemotes } from '../utils';
import { git, inferGithubField, appendGitignore } from '../utils/git';

export default class Init extends BaseCommand {
  static description = 'Initialize a tuture tutorial';

  static flags = {
    help: flags.help({ char: 'h' }),
    yes: flags.boolean({
      char: 'y',
      description: 'do not ask for prompts',
    }),
  };

  async promptInitGit(yes: boolean) {
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
      this.exit(0);
    } else {
      await git.init();
      logger.log('success', 'Git repository is initialized!');
    }
  }

  async promptMetaData(yes: boolean) {
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

  async run() {
    const { flags } = this.parse(Init);

    if (fs.existsSync(collectionPath)) {
      logger.log('success', 'Tuture tutorial has already been initialized!');
      this.exit(0);
    }

    if (!(await git.checkIsRepo())) {
      await this.promptInitGit(flags.yes);
    }

    const meta = await this.promptMetaData(flags.yes);

    try {
      const steps = await makeSteps(this.userConfig.ignoredFiles);
      const defaultArticleId = randHex(8);

      steps.forEach((step) => {
        step.articleId = defaultArticleId;
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

      const remotes = await git.getRemotes(true);

      if (remotes.length > 0) {
        if (flags.yes) {
          collection.remotes = [remotes[0]];
        } else {
          collection.remotes = await selectRemotes(remotes);
        }
      }

      collection.version = SCHEMA_VERSION;

      saveCollection(collection);
      appendGitignore();

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
