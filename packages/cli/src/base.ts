import { Command } from '@oclif/command';
import fs from 'fs-extra';
import rc from 'rc';
import { TUTURE_ROOT, TUTURE_IGNORE_PATH } from '@tuture/core';

import defaultConfig from './config';
import logger from './utils/logger';
import { checkInitStatus } from './utils';
import { EXIT_CODE } from './constants';
import { git } from './utils/git';

export default abstract class BaseCommand extends Command {
  // User configurations.
  userConfig: any = defaultConfig;

  async init() {
    this.userConfig = rc('tuture', defaultConfig);

    // Check initialization status when running commands except `init`.
    if (this.id !== 'init') {
      try {
        await checkInitStatus();
      } catch (err) {
        logger.log('error', err.message);
        this.exit(EXIT_CODE.NOT_INIT);
      }
    }

    if (!fs.existsSync(TUTURE_ROOT)) {
      fs.mkdirSync(TUTURE_ROOT);
    }

    if (fs.existsSync(TUTURE_IGNORE_PATH)) {
      const patterns = this.userConfig.ignoredFiles.concat(
        fs
          .readFileSync(TUTURE_IGNORE_PATH)
          .toString()
          .split('\n')
          .filter((pattern) => !pattern.match(/#/) && pattern.match(/\b/)),
      );
      this.userConfig.ignoredFiles = patterns;
    }
  }

  async finally() {
    // Clean tuture root if it's empty, since it's created for no reason..
    if (
      fs.existsSync(TUTURE_ROOT) &&
      fs.readdirSync(TUTURE_ROOT).length === 0
    ) {
      fs.removeSync(TUTURE_ROOT);
    }

    if (await git.checkIsRepo()) {
      const { all } = await git.branchLocal();
      if (all.includes('master')) {
        try {
          // Ensure we are back to master branch.
          await git.checkout(['-q', 'master']);
        } catch {
          // Just silently failed.
        }
      }
    }
  }
}
