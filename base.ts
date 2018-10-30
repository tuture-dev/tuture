import { Command } from '@oclif/command';
import fs from 'fs-extra';

import defaultConfig, { TUTURE_ROOT, CONFIG_PATH } from './config';

export default abstract class BaseCommand extends Command {
  readonly tutureRoot = TUTURE_ROOT;

  userConfig = defaultConfig;

  async init() {
    if (!fs.existsSync(CONFIG_PATH)) {
      if (!fs.existsSync(TUTURE_ROOT)) {
        fs.mkdirSync(TUTURE_ROOT);
      }
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig));
      this.userConfig = defaultConfig;
    } else {
      this.userConfig = JSON.parse(fs.readFileSync(CONFIG_PATH).toString());
    }
  }

  async finally() {
    fs.removeSync(CONFIG_PATH);

    // Clean tuture root if it's empty, since it's created for no reason..
    if (
      fs.existsSync(TUTURE_ROOT) &&
      fs.readdirSync(TUTURE_ROOT).length === 0
    ) {
      fs.removeSync(TUTURE_ROOT);
    }
  }
}
