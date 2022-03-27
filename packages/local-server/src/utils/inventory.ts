import debug from 'debug';
import { Collection } from '@tuture/core';
import { LowSync, JSONFileSync } from 'lowdb';

import { getInventoryPath } from './path.js';

const d = debug('tuture:local-server:inventory');

export interface InventoryItem {
  id: string;
  path: string;
  lastOpen: string;
}

export interface Inventory {
  items: InventoryItem[];
}

// initialize inventory db on module load to avoid concurrent initialization
const db = new LowSync<Inventory>(new JSONFileSync(getInventoryPath()));
db.read();
db.data = db.data || { items: [] };
d('db.data: %o', db.data);

process.on('exit', () => db.write());

export function getInventoryItemByCollectionId(collectionId: string) {
  d('getInventoryItemByCollectionId %s', collectionId);
  return db.data!.items.find((item) => item.id === collectionId);
}

export function getInventoryItemByPath(path: string) {
  d('getInventoryItemByPath %s', path);
  return db.data!.items.find((item) => item.path === path);
}

// Save the collection to global inventory.
export function saveToInventory(path: string, collection: Collection) {
  const item = db.data!.items.find(
    (item) => item.id === collection.id || item.path === path,
  );
  if (!item) {
    db.data!.items.push({
      path,
      id: collection.id,
      lastOpen: new Date().toISOString(),
    });
    db.write();
  }
}

// Remove a collection from the inventory.
export function removeFromInventory(collectionId: string) {
  const index = db.data!.items.findIndex((item) => item.id === collectionId);
  if (index > -1) {
    db.data!.items.splice(index, 1);
    db.write();
  }
}
