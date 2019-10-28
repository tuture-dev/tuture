import crypto from 'crypto';
import fs from 'fs-extra';
import { flags } from '@oclif/command';
import { prompt } from 'inquirer';
import yaml from 'js-yaml';

import logger from '../utils/logger';
import BaseCommand from '../base';
import { Tuture, TutureMeta } from '../types';
import { makeSteps, removeTutureSuite } from '../utils';
import * as git from '../utils/git';
import { TUTURE_YML_PATH } from '../constants';

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
      await git.initGit();
      logger.log('success', 'Git repository is initialized!');
    }
  }

  async promptMetaData(yes: boolean): Promise<TutureMeta> {
    const answer: any = yes
      ? { name: 'My Awesome Tutorial' }
      : await prompt([
        {
          name: 'name',
          message: 'Tutorial Name',
          default: 'My Awesome Tutorial',
        },
        {
          name: 'topics',
          message: 'Topics',
        },
      ]);
    answer.id = crypto.randomBytes(16).toString('hex');
    if (answer.topics) {
      answer.topics = answer.topics.split(/\W+/);
    } else {
      delete answer.topics;
    }
    return answer as TutureMeta;
  }

  async run() {
    const { flags } = this.parse(Init);

    if (fs.existsSync(TUTURE_YML_PATH)) {
      logger.log('success', 'Tuture tutorial has already been initialized!');
      this.exit(0);
    }

    if (!git.isGitAvailable()) {
      logger.log('error', 'Git is not installed on your machine!');
      this.exit(1);
    }

    if (!fs.existsSync('.git')) {
      await this.promptInitGit(flags.yes);
    }

    const tutureMeta = await this.promptMetaData(flags.yes);

    try {
      const tuture: Tuture = {
        ...tutureMeta,
        created: new Date(),
        updated: new Date(),
        steps: await makeSteps(this.userConfig.ignoredFiles),
      };

      fs.writeFileSync(TUTURE_YML_PATH, yaml.safeDump(tuture));

      git.appendGitignore();
      git.appendGitHook();

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
