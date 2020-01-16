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
} from '../constants';
import { assetsTablePath } from './assets';

export const tutureYMLPath = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  TUTURE_YML_PATH,
);

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
export async function loadTuture(): Promise<Tuture> {
  if (!fs.existsSync(tutureYMLPath)) {
    const hasLocalBranch = await hasLocalTutureBranch();
    const hasRemoteBranch = await hasRemoteTutureBranch();

    if (!hasLocalBranch && !hasRemoteBranch) {
      logger.log('error', 'Not in a valid Tuture tutorial.');
      process.exit(1);
    } else if (!hasLocalBranch) {
      await git.fetch('origin', TUTURE_BRANCH);
    }

    const { current } = await git.branch([]);
    await git.checkout(TUTURE_BRANCH);
    fs.copySync(TUTURE_YML_PATH, tutureYMLPath);
    if (fs.existsSync(ASSETS_JSON_PATH)) {
      fs.copySync(ASSETS_JSON_PATH, assetsTablePath);
    }
    await git.checkout(current);
  }

  const plainTuture = fs.readFileSync(tutureYMLPath).toString();

  // Check for tuture.yml syntax.
  try {
    yaml.safeLoad(plainTuture);
  } catch (err) {
    logger.log('error', err.message);
    process.exit(1);
  }

  return yaml.safeLoad(plainTuture);
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
export async function fetchRemoteTutureBranch() {
  const { all: allBranches } = await git.branch({ '-a': true });
  const remoteName = await git.remote([]);

  if (!remoteName) {
    logger.log('warning', 'No remote found for this repository.');
    return;
  }

  const remoteBranch = `remotes/${remoteName.trim()}/${TUTURE_BRANCH}`;
  logger.info('info', 'Trying to fetch remote tuture branch.');
  if (allBranches.indexOf(remoteBranch) < 0) {
    logger.log('warning', 'No remote branch for tuture. Fetch cancelled.');
  } else {
    await git.fetch(remoteName.trim());
    logger.log('success', 'Remote tuture branch has been fetched.');
  }
}
