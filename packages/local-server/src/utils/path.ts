import os from 'os';
import path from 'path';

const tuturePath =
  process.env.TUTURE_PATH || path.join(os.homedir(), '.tuture');

export const inventoryPath = path.join(tuturePath, 'inventory.json');

export const collectionsRoot = path.join(tuturePath, 'collections');

export const docsRoot = path.join(tuturePath, 'docs');

export const assetsRoot = path.join(tuturePath, 'assets');
