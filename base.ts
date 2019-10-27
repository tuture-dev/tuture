import { Command } from '@oclif/command';
import fs from 'fs-extra';
import rc from 'rc';

import defaultConfig from './config';
import { TUTURE_ROOT, TUTURE_IGNORE_PATH } from './constants';

export default abstract class BaseCommand extends Command {
  // User configurations.
  userConfig: any = defaultConfig;

  async init() {
    this.userConfig = rc('tuture', defaultConfig);

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
  }
}
