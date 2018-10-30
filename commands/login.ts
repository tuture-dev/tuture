import fs from 'fs-extra';
import { prompt } from 'inquirer';
import { flags } from '@oclif/command';
import { request, ClientError } from 'graphql-request';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { GRAPHQL_SERVER, TOKEN_PATH, GLOBAL_TUTURE_ROOT } from '../config';

type Credentials = {
  email: string;
  password: string;
};

type LoginData = {
  login: {
    token: string;
  };
};

export default class Login extends BaseCommand {
  static description = 'Login to tuture account';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async promptCredentials() {
    const response = await prompt<Credentials>([
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
    if (!fs.existsSync(GLOBAL_TUTURE_ROOT)) {
      fs.mkdirSync(GLOBAL_TUTURE_ROOT);
    }
    fs.writeFileSync(TOKEN_PATH, token);
  }

  async run() {
    this.parse(Login);

    const { email, password } = await this.promptCredentials();

    const query = `
      mutation login(
        $email: String!,
        $password: String!
      ) {
        login(
          email: $email
          password: $password
        ) {
          token
        }
      }
    `;
    const variables = {
      email,
      password,
    };

    request<LoginData>(GRAPHQL_SERVER, query, variables)
      .then((data) => {
        this.saveToken(data.login.token);
        logger.log('success', 'You have logged in!');
      })
      .catch((err: ClientError) => {
        if (!err.response) {
          logger.log({
            level: 'error',
            message: 'Cannot connect to tuture remote server.',
            error: err,
          });
        } else if (err.response.errors) {
          logger.log({
            level: 'error',
            message: 'Invalid username or password.',
            error: err,
          });
        }

        // We don't use `exit` method from `Command` base class here.
        // Or we'll get nasty unhandled promise rejection warning.
        process.exit(1);
      });
  }
}
