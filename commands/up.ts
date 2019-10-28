import open from 'open';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import { flags } from '@oclif/command';

import BaseCommand from '../base';
import logger from '../utils/logger';
import reload from './reload';
import makeServer from '../server';
import { TUTURE_YML_PATH } from '../constants';

export default class Up extends BaseCommand {
  static description = 'Render and edit tutorial in browser';

  static flags = {
    help: flags.help({ char: 'h' }),
    port: flags.integer({
      char: 'p',
      description: 'which port to use for tutorial server',
    }),
  };

  async fireTutureServer() {
    const portToUse = this.userConfig.port;
    const server = makeServer(this.userConfig);

    server.listen(portToUse, () => {
      const url = `http://localhost:${portToUse}`;
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

    if (!fs.existsSync(TUTURE_YML_PATH)) {
      logger.log('error', 'tuture.yml not found!');
      this.exit(1);
    }

    // Check for tuture.yml syntax.
    try {
      yaml.safeLoad(fs.readFileSync(TUTURE_YML_PATH).toString());
    } catch (err) {
      logger.log('error', err.message);
      this.exit(1);
    }

    await reload.run([]);

    this.fireTutureServer();
  }
}
