import debug from 'debug';
import fs from 'fs-extra';
import path from 'path';
import {
  INode,
  Collection,
  SCHEMA_VERSION,
  convertV1ToV2,
  StepDoc,
} from '@tuture/core';
import { Low, JSONFile } from 'lowdb';

import { getCollectionsRoot } from './path.js';
import { getInventoryItemByPath } from './inventory.js';

const d = debug('tuture:local-server:collection');

const dbMap = new Map<string, Low<Collection>>();

process.on('exit', async () => {
  console.log('Saving db data to disk...');
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
  return path.join(getCollectionsRoot(), `${collectionId}.json`);
}

export async function getCollectionDb(collectionId?: string) {
  collectionId = collectionId || (await getCollectionIdFromCwd());
  d('getCollectionDb for collection id: %s', collectionId);
  let db = dbMap.get(collectionId);
  if (!db) {
    await fs.ensureDir(getCollectionsRoot());
    const collectionPath = await getCollectionPath(collectionId);
    d('getCollectionDb from %s', collectionPath);
    db = new Low<Collection>(new JSONFile(collectionPath));
    await db.read();
    dbMap.set(collectionId, db);
    d('updated dbMap: %o', dbMap);
  }
  return db;
}

/**
 * Load collection.
 */
export async function loadCollection(collectionId?: string) {
  const db = await getCollectionDb(collectionId);

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

  return db.data!;
}

/**
 * Save the entire collection.
 */
export async function saveCollection(collection: Collection) {
  const db = await getCollectionDb(collection.id);
  db.data = collection;
  await db.write();
  d('save collection %s', collection.id);
}

export async function deleteCollection(collectionId: string) {
  await fs.remove(await getCollectionPath(collectionId));
}
