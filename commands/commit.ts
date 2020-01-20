import cp from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { flags } from '@oclif/command';
import { prompt } from 'inquirer';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { git } from '../utils/git';
import { assetsTablePath, assetsTableCheckpoint } from '../utils/assets';
import {
  tutureYMLPath,
  tutureYMLCheckpoint,
  initializeTutureBranch,
} from '../utils/tuture';
import { TUTURE_BRANCH } from '../constants';

export default class Commit extends BaseCommand {
  static description = 'Commit your tutorial to VCS (Git)';

  static flags = {
    help: flags.help({ char: 'h' }),
    message: flags.string({
      char: 'm',
      description: 'commit message',
    }),
  };

  async run() {
    const { flags } = this.parse(Commit);
    this.userConfig = Object.assign(this.userConfig, flags);

    const message =
      flags.message ||
      ((await prompt([
        {
          name: 'message',
          type: 'input',
          default: `Commit on ${new Date()}`,
        },
      ])) as any).message;

    await initializeTutureBranch();

    // Checkout tuture branch and add tuture.yml.
    await git.checkout(TUTURE_BRANCH);
    await git.merge(['master']);

    // Trying to copy and add tuture.yml to staging.
    const targetTutureYML = path.join(
      process.cwd(),
      path.basename(tutureYMLPath),
    );
    fs.copySync(tutureYMLPath, targetTutureYML);
    await git.add(targetTutureYML);

    // Trying to copy and add tuture-assets.json to staging.
    const targetAssetsTable = path.join(
      process.cwd(),
      path.basename(assetsTablePath),
    );
    if (fs.existsSync(assetsTablePath)) {
      fs.copySync(assetsTablePath, targetAssetsTable);
      await git.add(targetAssetsTable);
    }

    fs.removeSync(tutureYMLCheckpoint);
    fs.removeSync(assetsTableCheckpoint);

    // Commit changes to tuture branch.
    cp.execSync(`git commit --allow-empty -m "tuture: ${message}"`);
    logger.log('success', `Committed to branch ${TUTURE_BRANCH} (${message})`);
  }
}
