import fs from 'fs-extra';
import path from 'path';
import {
  INode,
  Collection,
  TUTURE_ROOT,
  TUTURE_VCS_ROOT,
  COLLECTION_PATH,
  TUTURE_DOC_ROOT,
  COLLECTION_CHECKPOINT,
  SCHEMA_VERSION,
  convertV1ToV2,
  StepDoc,
} from '@tuture/core';
import { collectionsRoot } from './path';

export const collectionPath = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  COLLECTION_PATH,
);

export const tutureDocRoot = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  TUTURE_DOC_ROOT,
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
export function loadCollection(collectionId: string): Collection {
  const collectionPath = path.join(collectionsRoot, `${collectionId}.json`);
  let collection = fs.readJSONSync(collectionPath);

  // if (collection.version !== 'v1' && collection.version !== SCHEMA_VERSION) {
  //   throw new Error(
  //     'incompatible collection version, please contact mrc@mail.tuture.co to fix it',
  //   );
  // }

  // if (collection.version === 'v1') {
  //   let [collectionV2, stepDocs] = convertV1ToV2(collection);
  //   collection = collectionV2;
  //   collection.version = SCHEMA_VERSION;

  //   Object.entries(stepDocs).forEach(([id, doc]) => saveStepSync(id, doc));
  // }

  return collection;
}

/**
 * Save the entire collection back to workspace.
 */
export function saveCollection(collection: Collection) {
  collection.version = SCHEMA_VERSION;
  const dest = path.join(collectionsRoot, `${collection.id}.json`);
  fs.outputJSONSync(dest, collection, { spaces: 2 });
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
