import opn from 'opn';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import { flags } from '@oclif/command';

import BaseCommand from '../base';
import reload from './reload';
import server from '../server';

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
        this.error(
          `Port ${portToUse} has been occupied. Please choose a new port.`,
        );
        this.exit(1);
      }
      const url = `http://localhost:${portToUse}`;
      this.success(`Tutorial is served on ${url}`);
      opn(url);
    });
  }

  async run() {
    const { flags } = this.parse(Up);

    if (!fs.existsSync('tuture.yml')) {
      this.error('tuture.yml not found!');
      this.exit(1);
    }

    // Check for tuture.yml syntax.
    try {
      yaml.safeLoad(fs.readFileSync('tuture.yml').toString());
    } catch (err) {
      this.error(err.message);
      this.exit(1);
    }

    await reload.run([]);

    this.fireTutureServer(flags.port);
  }
}
