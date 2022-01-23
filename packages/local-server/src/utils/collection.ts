import fs from 'fs-extra';
import path from 'path';
import {
  INode,
  Collection,
  SCHEMA_VERSION,
  convertV1ToV2,
  StepDoc,
} from '@tuture/core';
import { collectionsRoot } from './path.js';

/**
 * Load collection.
 */
export async function loadCollection(collectionId: string) {
  const collectionPath = path.join(collectionsRoot, `${collectionId}.json`);
  let collection: Collection = await fs.readJSON(collectionPath);

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
export async function saveCollection(collection: Collection) {
  collection.version = SCHEMA_VERSION;
  const dest = path.join(collectionsRoot, `${collection.id}.json`);
  await fs.outputJSON(dest, collection, { spaces: 2 });
}
