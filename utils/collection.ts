import fs from 'fs-extra';
import path from 'path';

import { Collection } from '../types';
import logger from './logger';
import { git } from './git';
import {
  TUTURE_ROOT,
  COLLECTION_PATH,
  TUTURE_BRANCH,
  COLLECTION_CHECKPOINT,
} from '../constants';
import { assetsTablePath, assetsTableCheckpoint } from './assets';

export const collectionPath = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  COLLECTION_PATH,
);

export const collectionCheckpoint = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  COLLECTION_CHECKPOINT,
);

export function hasTutureChangedSinceCheckpoint() {
  if (!fs.existsSync(collectionCheckpoint)) {
    return true;
  }
  return !fs
    .readFileSync(collectionPath)
    .equals(fs.readFileSync(collectionCheckpoint));
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

  const branchExists = async (branch: string) => {
    const { all } = await git.branch({ '-a': true });
    return all.includes(remoteBranch);
  };

  const remoteBranch = `remotes/${remote.trim()}/${TUTURE_BRANCH}`;

  // Trying to update remote branches (time-consuming).
  await git.remote(['update', '--prune']);

  return await branchExists(remoteBranch);
}

/**
 * Load collection.
 */
export function loadCollection(): Collection {
  return JSON.parse(fs.readFileSync(collectionPath).toString());
}

/**
 * Save the entire collection back to workspace.
 */
export function saveCollection(collection: Collection) {
  fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
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

export function saveCheckpoint() {
  // Copy the last committed file.
  fs.copySync(collectionPath, collectionCheckpoint, { overwrite: true });

  if (fs.existsSync(assetsTablePath)) {
    fs.copySync(assetsTablePath, assetsTableCheckpoint, {
      overwrite: true,
    });
  }
}
