import fs from 'fs-extra';
import { Request } from 'express';
import debug from 'debug';
import path from 'path';
import {
  INode,
  Collection,
  SCHEMA_VERSION,
  convertV1ToV2,
  StepDoc,
} from '@tuture/core';
import { Low, JSONFile } from 'lowdb';

import { collectionsRoot } from './path.js';
import { getInventoryItemByPath } from './inventory.js';

const d = debug('tuture:local-server:collection');

let dbMap: Map<string, Low<Collection>>;

process.on('exit', async () => {
  dbMap.forEach(async (db) => await db.write());
});

async function getCollectionIdFromCwd() {
  const item = await getInventoryItemByPath(process.cwd());
  if (!item) {
    throw new Error(
      'collection not ready, please run `tuture init` to initialize',
    );
  }
  return item.id;
}

async function getCollectionPath(collectionId?: string) {
  collectionId = collectionId || (await getCollectionIdFromCwd());
  return path.join(collectionsRoot, `${collectionId}.json`);
}

export async function getCollectionDb(collectionId?: string) {
  collectionId = collectionId || (await getCollectionIdFromCwd());
  let db = dbMap.get(collectionId);
  if (!db) {
    const collectionPath = await getCollectionPath(collectionId);
    db = new Low<Collection>(new JSONFile(collectionPath));
    await db.read();
    dbMap.set(collectionId, db);
  }
  return db;
}

/**
 * Load collection.
 */
export async function loadCollection(collectionId?: string) {
  const collectionPath = await getCollectionPath(collectionId);
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
  const collectionPath = await getCollectionPath(collection.id);
  await fs.outputJSON(collectionPath, collection, { spaces: 2 });
  d('save collection to %s', collectionPath);
}
