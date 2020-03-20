import chalk from 'chalk';
import open from 'open';
import fs from 'fs-extra';
import getPort from 'get-port';
import { flags } from '@oclif/command';

import reload from './reload';
import BaseCommand from '../base';
import logger from '../utils/logger';
import makeServer from '../server';
import { checkInitStatus } from '../utils';
import { diffPath } from '../utils/git';
import { syncImages } from '../utils/assets';
import { loadCollection, collectionPath } from '../utils/collection';

export default class Up extends BaseCommand {
  static description = 'Render and edit tutorial in browser';

  static flags = {
    help: flags.help({ char: 'h' }),
    port: flags.integer({
      char: 'p',
      description: 'which port to use for editor server',
    }),
  };

  async fireTutureServer() {
    const port = await getPort({ port: this.userConfig.port });
    const server = makeServer(this.userConfig);

    server.listen(port, () => {
      const url = `http://localhost:${port}`;
      logger.log('success', `Tutorial editor is served on ${url}`);

      // Don't open browser in test environment.
      if (process.env.TEST !== 'yes') {
        open(url);
      }
    });
  }

  async run() {
    const { flags } = this.parse(Up);
    this.userConfig = Object.assign(this.userConfig, flags);

    try {
      await checkInitStatus();
    } catch (err) {
      logger.log('error', err.message);
      this.exit(1);
    }

    // Run sync command if workspace is not prepared.
    if (!fs.existsSync(collectionPath) || !fs.existsSync(diffPath)) {
      await reload.run([]);
    }

    // Trying to load tuture.yml for sanity check.
    loadCollection();

    // Background interval to synchronize assets.
    syncImages();
    setInterval(syncImages, this.userConfig.assetsSyncInterval);

    this.fireTutureServer();
  }
}
