import debug from 'debug';
import fs from 'fs-extra';
import path from 'path';
import { INode, Collection, SCHEMA_VERSION } from '@tuture/core';
import { LowSync, JSONFileSync } from 'lowdb';

import { getCollectionsRoot } from './path.js';
import { getInventoryItemByPath } from './inventory.js';

const d = debug('tuture:local-server:collection');

const dbMap = new Map<string, LowSync<Collection>>();

process.on('exit', async () => {
  dbMap.forEach(async (db) => await db.write());
});

function getCollectionIdFromCwd() {
  const cwd = process.cwd();
  d('getCollectionIdFromCwd for cwd: %s', cwd);
  const item = getInventoryItemByPath(cwd);
  if (!item) {
    throw new Error(
      'collection not ready, please run `tuture init` to initialize',
    );
  }
  return item.id;
}

function getCollectionPath(collectionId?: string) {
  d('getCollectionPath for collection id: %s', collectionId);
  collectionId = collectionId || getCollectionIdFromCwd();
  return path.join(getCollectionsRoot(), `${collectionId}.json`);
}

export function getCollectionDb(collectionId?: string) {
  d('getCollectionDb for collection id: %s', collectionId);
  collectionId = collectionId || getCollectionIdFromCwd();
  let db = dbMap.get(collectionId);
  if (!db) {
    fs.ensureDirSync(getCollectionsRoot());
    const collectionPath = getCollectionPath(collectionId);
    d('getCollectionDb from %s', collectionPath);
    db = new LowSync<Collection>(new JSONFileSync(collectionPath));
    db.read();
    dbMap.set(collectionId, db);
    d('updated dbMap: %o', dbMap);
  }
  return db;
}

/**
 * Load collection.
 */
export function loadCollection(collectionId?: string) {
  const db = getCollectionDb(collectionId);

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
export function saveCollection(collection: Collection) {
  const db = getCollectionDb(collection.id);
  db.data = collection;
  db.write();
  d('save collection %s', collection.id);
}

export async function deleteCollection(collectionId: string) {
  await fs.remove(getCollectionPath(collectionId));
}
