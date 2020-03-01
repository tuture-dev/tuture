import fs from 'fs';
import { flags } from '@oclif/command';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { syncImages, assetsTablePath } from '../utils/assets';

export default class DownloadAssets extends BaseCommand {
  static description = 'Download all assets to local workspace';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(DownloadAssets);
    this.userConfig = Object.assign(this.userConfig, flags);

    if (!fs.existsSync(assetsTablePath)) {
      logger.log('warning', 'No assets found.');
      this.exit(0);
    }

    await syncImages();
  }
}
