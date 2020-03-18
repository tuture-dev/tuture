import { Command } from '@oclif/command';
import fs from 'fs-extra';
import rc from 'rc';

import { checkInitStatus } from './utils';
import { git, appendGitHook, removeGitHook } from './utils/git';
import { removeAssetsLock } from './utils/assets';
import defaultConfig from './config';
import { TUTURE_ROOT, TUTURE_IGNORE_PATH } from './constants';

export default abstract class BaseCommand extends Command {
  // User configurations.
  userConfig: any = defaultConfig;

  async init() {
    this.userConfig = rc('tuture', defaultConfig);

    if (await checkInitStatus(true)) {
      appendGitHook();
      removeAssetsLock();

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
  }

  async finally() {
    // Clean tuture root if it's empty, since it's created for no reason..
    if (
      fs.existsSync(TUTURE_ROOT) &&
      fs.readdirSync(TUTURE_ROOT).length === 0
    ) {
      fs.removeSync(TUTURE_ROOT);
      removeGitHook();
    }

    if (await git.checkIsRepo()) {
      const { all } = await git.branchLocal();
      if (all.includes('master')) {
        // Ensure we are back to master branch.
        await git.checkout(['-q', 'master']);
      }
    }
  }
}
