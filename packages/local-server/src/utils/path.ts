import os from 'os';
import path from 'path';

export function getTuturePath() {
  return process.env.TUTURE_PATH || path.join(os.homedir(), '.tuture');
}

export function getInventoryPath() {
  return path.join(getTuturePath(), 'inventory.json');
}

export function getCollectionsRoot() {
  return path.join(getTuturePath(), 'collections');
}

export function getDocsRoot() {
  return path.join(getTuturePath(), 'docs');
}

export function getAssetsRoot() {
  return path.join(getTuturePath(), 'assets');
}
