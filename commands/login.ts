import fs from 'fs-extra';
import request from 'request';
import { flags } from '@oclif/command';
import { prompt } from 'inquirer';

import BaseCommand from '../base';
import { apiEndpoint, apiTokenPath, globalTutureRoot } from '../config';

export default class Login extends BaseCommand {
  static description = 'Login to tuture account';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async promptCredentials() {
    const response = await prompt([
      {
        name: 'email',
        message: 'Email',
      },
      {
        type: 'password',
        name: 'password',
        message: 'Password',
      },
    ]);

    return response;
  }

  saveToken(token: string) {
    if (!fs.existsSync(globalTutureRoot)) {
      fs.mkdirSync(globalTutureRoot);
    }
    fs.writeFileSync(apiTokenPath, token);
  }

  async run() {
    this.parse(Login);

    const credentials = await this.promptCredentials();

    request.post(
      `${apiEndpoint}/auth`,
      { form: credentials },
      (err, res, body) => {
        if (err) {
          this.error(err.message);
          this.exit(1);
        }

        if (res.statusCode === 200) {
          this.saveToken(JSON.parse(body).token as string);
          this.success('Login successfully!');
        } else if (res.statusCode === 401) {
          this.log('Invalid email or password.');
        } else {
          this.log(body);
        }
      },
    );
  }
}
