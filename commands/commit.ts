import fs from 'fs-extra';
import path from 'path';
import cp from 'child_process';
import { flags } from '@oclif/command';
import simplegit from 'simple-git/promise';

import BaseCommand from '../base';

import logger from '../utils/logger';
import { assetsTablePath } from '../utils/assets';
import { tutureYMLPath } from '../utils/tuture';
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

    const git = simplegit();
    const branchSum = await git.branchLocal();

    // Create the tuture branch if not exist.
    if (branchSum.all.indexOf(TUTURE_BRANCH) < 0) {
      cp.execSync(`git branch ${TUTURE_BRANCH}`);
    }

    // Checkout tuture branch and add tuture.yml.
    cp.execSync(`git checkout -q ${TUTURE_BRANCH}`);
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

    // Commit changes to tuture branch.
    const message = flags.message || `Commit on ${new Date()}`;
    cp.execSync(`git commit --allow-empty -m "tuture: ${message}"`);
    logger.log('success', `Committed to branch ${TUTURE_BRANCH} (${message})`);
  }
}
