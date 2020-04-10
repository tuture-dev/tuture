import fs from 'fs-extra';
import path from 'path';

import { Collection } from '../types';
import logger from './logger';
import { git } from './git';
import {
  TUTURE_ROOT,
  TUTURE_VCS_ROOT,
  COLLECTION_PATH,
  TUTURE_BRANCH,
  COLLECTION_CHECKPOINT,
} from '../constants';
import { loadAssetsTable } from './assets';

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

export const collectionVcsPath = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_VCS_ROOT,
  COLLECTION_PATH,
);

export function hasCollectionChangedSinceCheckpoint() {
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
  let rawCollection = fs.readFileSync(collectionPath).toString();
  const assetsTable = loadAssetsTable();

  // COMPAT: convert all asset paths
  assetsTable.forEach((asset) => {
    const { localPath, hostingUri } = asset;
    if (hostingUri) {
      rawCollection = rawCollection.replace(
        new RegExp(localPath, 'g'),
        hostingUri,
      );
    }
  });
  const collection = JSON.parse(rawCollection);

  // COMPAT: convert hiddenLines field
  if (collection.version !== 'v1') {
    const convertHiddenLines = (hiddenLines: number[]) => {
      const rangeGroups = [];
      let startNumber = null;

      for (let i = 0; i < hiddenLines.length; i++) {
        const prev = hiddenLines[i - 1];
        const current = hiddenLines[i];
        const next = hiddenLines[i + 1];

        if (current !== prev + 1 && current !== next - 1) {
          rangeGroups.push([current, current]);
        } else if (current !== prev + 1) {
          startNumber = hiddenLines[i];
        } else if (current + 1 !== next) {
          rangeGroups.push([startNumber, hiddenLines[i]]);
        }
      }

      return rangeGroups;
    };

    for (const step of collection.steps) {
      for (const node of step.children) {
        if (node.type === 'file') {
          const diffBlock = node.children[1];
          if (diffBlock.hiddenLines) {
            diffBlock.hiddenLines = convertHiddenLines(diffBlock.hiddenLines);
          }
        }
      }
    }

    collection.version = 'v1';
  }

  return collection;
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
}
