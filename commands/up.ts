import opn from 'opn';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import { flags } from '@oclif/command';

import BaseCommand from '../base';
import logger from '../utils/logger';
import reload from './reload';
import server from '../server';
import { TUTURE_YML_PATH } from '../config';

export default class Up extends BaseCommand {
  static description = 'Render and edit tutorial in browser';

  static flags = {
    help: flags.help({ char: 'h' }),
    port: flags.integer({
      char: 'p',
      description: 'which port to use for tutorial server',
    }),
  };

  async fireTutureServer(port?: number) {
    const portToUse = port || 3000;

    server.listen(portToUse, (err: Error) => {
      if (err) {
        logger.log(
          'error',
          `Port ${portToUse} has been occupied. Please choose a new port.`,
        );
        this.exit(1);
      }
      const url = `http://localhost:${portToUse}`;
      this.success(`Tutorial is served on ${url}`);

      // Don't open browser in test environment.
      if (!process.env.TEST) {
        opn(url);
      }
    });
  }

  async run() {
    const { flags } = this.parse(Up);

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

    this.fireTutureServer(flags.port);
  }
}
