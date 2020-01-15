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
    const targetTutureYML = path.join(
      process.cwd(),
      path.basename(tutureYMLPath),
    );
    fs.copySync(tutureYMLPath, targetTutureYML);
    cp.execSync(`git add ${targetTutureYML}`);

    if (fs.existsSync(assetsTablePath)) {
      const targetAssetsTable = path.join(
        process.cwd(),
        path.basename(assetsTablePath),
      );
      fs.copySync(assetsTablePath, targetAssetsTable);
      cp.execSync(`git add ${targetAssetsTable}`);
    }

    const { staged } = await git.status();

    if (staged.length > 0) {
      // Commit changes to tuture branch.
      const message = flags.message || `Commit on ${new Date()}`;
      cp.execSync(`git commit -m "${message}"`);
      logger.log(
        'success',
        `Committed to branch ${TUTURE_BRANCH} (${message})`,
      );
    } else {
      logger.log('info', 'Nothing to commit.');
    }

    // Switch back to original branch.
    cp.execSync(`git checkout -q ${branchSum.current}`);
  }
}
