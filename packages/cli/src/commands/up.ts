import open from 'open';
import fs from 'fs-extra';
import getPort from 'get-port';
import { flags } from '@oclif/command';
import {
  makeServer,
  loadCollection,
  collectionPath,
} from '@tuture/local-server';

import reload from './reload';
import BaseCommand from '../base';
import logger from '../utils/logger';
import { checkInitStatus } from '../utils';
import { diffPath, shouldReloadSteps } from '../utils/git';

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
    const server = makeServer({ baseUrl: '/api' });

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
    if (
      !fs.existsSync(collectionPath) ||
      !fs.existsSync(diffPath) ||
      (await shouldReloadSteps())
    ) {
      await reload.run([]);
    }

    // Trying to load collection for sanity check.
    loadCollection();

    this.fireTutureServer();
  }
}
