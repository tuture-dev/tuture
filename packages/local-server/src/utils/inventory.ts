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

let inventory: Low<Inventory> | null;

export function getInventoryDb() {
  const db = inventory || new Low(new JSONFile(inventoryPath));
  db.data = db.data || { items: [] };
  return db;
}

export function getInventoryItemByPath(path: string) {
  const db = getInventoryDb();
  return db.data!.items.find((item) => item.path === path);
}

// Save the collection to global inventory.
export async function saveToInventory(path: string, collection: Collection) {
  const db = getInventoryDb();
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
