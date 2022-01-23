import { Collection } from '@tuture/core';
import { Low, JSONFile } from 'lowdb';

import { inventoryPath } from './path.js';

export interface InventoryItem {
  id: string;
  path: string;
  lastOpen: string;
}

export interface Inventory {
  items: InventoryItem[];
}

let db: Low<Inventory>;

process.on('exit', async () => await db.write());

export async function getInventoryDb() {
  if (db.data === null) {
    db = new Low(new JSONFile(inventoryPath));
    await db.read();
  }
  db.data = db.data || { items: [] };
  return db;
}

export async function getInventoryItemByCollectionId(collectionId: string) {
  const db = await getInventoryDb();
  return db.data!.items.find((item) => item.id === collectionId);
}

export async function getInventoryItemByPath(path: string) {
  const db = await getInventoryDb();
  return db.data!.items.find((item) => item.path === path);
}

// Save the collection to global inventory.
export async function saveToInventory(path: string, collection: Collection) {
  const db = await getInventoryDb();
  const item = db.data!.items.find(
    (item) => item.id === collection.id || item.path === path,
  );
  if (!item) {
    db.data!.items.push({
      path,
      id: collection.id,
      lastOpen: new Date().toISOString(),
    });
    await db.write();
  }
}
