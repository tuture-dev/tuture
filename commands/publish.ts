import tmp from 'tmp';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import yaml from 'js-yaml';
import request from 'request';
import { flags } from '@oclif/command';
import { GraphQLClient } from 'graphql-request';

import BaseCommand from '../base';
import { Tuture } from '../types';
import {
  GRAPHQL_SERVER,
  TOKEN_PATH,
  STATIC_SERVER,
  FILE_UPLOAD_API,
} from '../config';

type FileUploadResponse = {
  tuture: string[];
  diff: string[];
  assets: string;
};

export default class Publish extends BaseCommand {
  static description = 'Publish tutorial to tuture.co';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  collectTutureAssets(tutureYml: string): [string, string[]] {
    const assets: string[] = [];

    // Replace all paths to local assets with ones on tuture static server.
    // For instance, ./tuture-assets/foo.png => https://static.tuture.co/foo.png.
    const updatedTuture = tutureYml.replace(
      /!\[.*\]\((.*)\)/g,
      (match, imagePath) => {
        assets.push(imagePath);
        return match.replace(imagePath, STATIC_SERVER + imagePath);
      },
    );

    return [updatedTuture, assets];
  }

  saveTutureToTmp(tuture: string) {
    const tmpDir = tmp.dirSync();
    const tmpPath = path.join(tmpDir.name, 'tuture.json');
    fs.writeFileSync(tmpPath, tuture);
    return tmpPath;
  }

  publishTutorial(tuture: Tuture, urls: FileUploadResponse): void {
    const query = `
      mutation {
        publish(
          name: "${tuture.name}"
          topics: {
            set: ${JSON.stringify(tuture.topics)}
          }
          description: "${tuture.description}"
          diffUri: "${urls.diff[0]}"
          tutureUri: "${urls.tuture[0]}"
        ) {
          id
        }
      }
    `;

    const client = new GraphQLClient(GRAPHQL_SERVER, {
      headers: {
        authorization: `Bearer ${fs.readFileSync(TOKEN_PATH).toString()}`,
      },
    });

    client
      .request(query)
      .then(() => {
        this.success('Your tutorial has been successfully published!');
      })
      .catch((err) => {
        this.log('Publish failed. Please retry.');
        this.log(err);
        this.exit(1);
      });
  }

  async run() {
    this.parse(Publish);

    if (!fs.existsSync(TOKEN_PATH)) {
      this.error(
        `You have not logged in yet. Please login with ${chalk.bold(
          'tuture login',
        )}.`,
      );
      this.exit(1);
    }

    const tutureYml = fs.readFileSync('tuture.yml').toString();
    const [updatedTutureYml, assets] = this.collectTutureAssets(tutureYml);
    const tuture: Tuture = yaml.safeLoad(updatedTutureYml);

    const formData: any = {
      tuture: fs.createReadStream(this.saveTutureToTmp(JSON.stringify(tuture))),
      diff: fs.createReadStream(path.join('.tuture', 'diff.json')),
      assets: assets.map((asset) => fs.createReadStream(asset)),
    };

    request.post(
      FILE_UPLOAD_API,
      {
        formData,
        headers: {
          Authorization: `Bearer ${fs.readFileSync(TOKEN_PATH).toString()}`,
        },
      },
      (err, res, body) => {
        if (err) {
          this.log(
            `Verification failed. Please relogin with ${chalk.bold(
              'tuture login',
            )}.`,
          );
          this.exit(1);
        }
        this.publishTutorial(tuture, JSON.parse(body));
      },
    );
  }
}
