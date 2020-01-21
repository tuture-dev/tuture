import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';

import { Tuture } from '../types';
import logger from '../utils/logger';
import { git } from '../utils/git';
import {
  TUTURE_ROOT,
  TUTURE_YML_PATH,
  TUTURE_BRANCH,
  ASSETS_JSON_PATH,
  TUTURE_YML_CHECKPOINT,
} from '../constants';
import { assetsTablePath, assetsTableCheckpoint } from './assets';

export const tutureYMLPath = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  TUTURE_YML_PATH,
);

export const tutureYMLCheckpoint = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  TUTURE_YML_CHECKPOINT,
);

export function hasTutureChangedSinceCheckpoint() {
  if (!fs.existsSync(tutureYMLCheckpoint)) {
    return false;
  }
  return !fs
    .readFileSync(tutureYMLPath)
    .equals(fs.readFileSync(tutureYMLCheckpoint));
}

/**
 * Whether the local tuture branch exists.
 */
export async function hasLocalTutureBranch() {
  return (await git.branchLocal()).all.includes(TUTURE_BRANCH);
}

/**
 * Whether the remote tuture branch exists.
 */
export async function hasRemoteTutureBranch() {
  const remote = await git.remote([]);

  if (!remote) {
    logger.log('warning', 'No remote found for this repository.');
    return false;
  }

  const remoteBranch = `remotes/${remote.trim()}/${TUTURE_BRANCH}`;
  if (!(await git.branch({ '-a': true })).all.includes(remoteBranch)) {
    logger.log('warning', 'No remote tuture branch.');
    return false;
  }

  return true;
}

/**
 * Load Tuture object from tuture.yml.
 */
export async function loadTuture(fromBranch = false): Promise<Tuture> {
  if (!fs.existsSync(tutureYMLPath)) {
    await initializeTutureBranch();
    await git.checkout(TUTURE_BRANCH);

    if (!fs.existsSync(TUTURE_YML_PATH)) {
      logger.log(
        'error',
        `Cannot load tuture. Please run ${chalk.bold(
          'tuture init',
        )} to initialize.`,
      );
      await git.checkout('master');
      process.exit(1);
    }

    fs.copySync(TUTURE_YML_PATH, tutureYMLPath);
    if (fs.existsSync(ASSETS_JSON_PATH)) {
      fs.copySync(ASSETS_JSON_PATH, assetsTablePath);
    }
  }

  if (fromBranch && fs.existsSync(TUTURE_YML_PATH)) {
    return yaml.safeLoad(fs.readFileSync(TUTURE_YML_PATH).toString());
  }
  return yaml.safeLoad(fs.readFileSync(tutureYMLPath).toString());
}

/**
 * Save Tuture object back to tuture.yml (temporary workspace).
 */
export function saveTuture(tuture: Tuture) {
  fs.writeFileSync(tutureYMLPath, yaml.safeDump(tuture));
}

/**
 * Fetch tuture branch from remote.
 */
export async function initializeTutureBranch() {
  const { all: allBranches } = await git.branch({ '-a': true });

  // Already exists.
  if (allBranches.includes(TUTURE_BRANCH)) {
    return;
  }

  const remoteBranchIndex = allBranches
    .map((branch) => branch.split('/').slice(-1)[0])
    .indexOf(TUTURE_BRANCH);

  if (remoteBranchIndex < 0) {
    await git.branch([TUTURE_BRANCH]);
    logger.log('info', 'New tuture branch has been created.');
  } else {
    const [_, remote, branch] = allBranches[remoteBranchIndex].split('/');
    await git.fetch(remote, branch);
    logger.log('success', 'Remote tuture branch has been fetched.');
  }
}

export async function saveCheckpoint() {
  // Copy the last committed file.
  fs.copySync(tutureYMLPath, tutureYMLCheckpoint, { overwrite: true });

  if (fs.existsSync(assetsTablePath)) {
    fs.copySync(assetsTablePath, assetsTableCheckpoint, {
      overwrite: true,
    });
  }
}
