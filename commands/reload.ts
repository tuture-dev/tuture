import fs from 'fs-extra';
import http from 'http';
import yaml from 'js-yaml';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { Step, Tuture } from '../types';
import { makeSteps, mergeSteps } from '../utils';
import { isGitAvailable } from '../utils/git';
import { TUTURE_YML_PATH } from '../constants';

export default class Reload extends BaseCommand {
  static description = 'Sync tuture files with current repo';

  // Notify server to reload.
  async notifyServer() {
    const url = `http://localhost:${this.userConfig.port}/reload`;
    return new Promise((resolve, _) => {
      http
        .get(url, (res) => {
          const { statusCode } = res;
          if (statusCode === 200) {
            logger.log('success', 'Server is ready to reload.');
          }
          resolve();
        })
        .on('error', () => {
          resolve();
        });
    });
  }

  async run() {
    this.parse(Reload);

    if (!fs.existsSync(TUTURE_YML_PATH)) {
      logger.log('error', 'Tuture tutorial has not been initialized!');
      this.exit(1);
    }

    if (!isGitAvailable()) {
      logger.log('error', 'Git is not installed on your machine!');
      this.exit(1);
    }

    const tuture: Tuture = yaml.safeLoad(
      fs.readFileSync(TUTURE_YML_PATH).toString(),
    );
    const currentSteps: Step[] = await makeSteps();
    tuture.steps = mergeSteps(tuture.steps, currentSteps);

    fs.writeFileSync(TUTURE_YML_PATH, yaml.safeDump(tuture));
    await this.notifyServer();
  }
}
