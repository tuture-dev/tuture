import fs from 'fs-extra';
import path from 'path';
import {
  Collection,
  TUTURE_ROOT,
  TUTURE_VCS_ROOT,
  COLLECTION_PATH,
  COLLECTION_CHECKPOINT,
  SCHEMA_VERSION,
} from '@tuture/core';

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

  // COMPAT: normalize children of all diff blocks
  for (const step of collection.steps) {
    for (const node of step.children) {
      if (node.type === 'file') {
        const diffBlock = node.children[1];
        diffBlock.children = [{ text: '' }];
      }
    }
  }

  return collection;
}

/**
 * Save the entire collection back to workspace.
 */
export function saveCollection(collection: Collection) {
  collection.version = SCHEMA_VERSION;
  fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
}

export function saveCheckpoint() {
  // Copy the last committed file.
  fs.copySync(collectionPath, collectionCheckpoint, { overwrite: true });
}

export function hasCollectionChangedSinceCheckpoint() {
  if (!fs.existsSync(collectionCheckpoint)) {
    return true;
  }
  return !fs
    .readFileSync(collectionPath)
    .equals(fs.readFileSync(collectionCheckpoint));
}
