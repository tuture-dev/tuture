import fs from 'fs-extra';
import path from 'path';
import request from 'request';

import logger from './logger';
import {
  TUTURE_ROOT,
  IMAGE_HOSTING_URL,
  ASSETS_JSON_PATH,
  ASSETS_JSON_CHECKPOINT,
} from '../constants';

export interface Asset {
  localPath: string;
  hostingUri?: string;
}

export const assetsTablePath = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  ASSETS_JSON_PATH,
);

export const assetsTableCheckpoint = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  ASSETS_JSON_CHECKPOINT,
);

const assetsTableLock = `${assetsTablePath}.lock`;

export function createAssetsLock() {
  fs.writeFileSync(assetsTableLock, '');
}

export function isAssetsLocked() {
  return fs.existsSync(assetsTableLock);
}

export function removeAssetsLock() {
  if (isAssetsLocked()) {
    fs.removeSync(assetsTableLock);
  }
}

export function hasAssetsChangedSinceCheckpoint() {
  if (!fs.existsSync(assetsTableCheckpoint)) {
    return false;
  }
  return !fs
    .readFileSync(assetsTablePath)
    .equals(fs.readFileSync(assetsTableCheckpoint));
}

/**
 * Load assets from tuture-assets.json.
 * If not present, return an empty array.
 */
export function loadAssetsTable(): Asset[] {
  if (fs.existsSync(assetsTablePath)) {
    return JSON.parse(fs.readFileSync(assetsTablePath).toString());
  }

  return [];
}

/**
 * Save assets back to tuture-assets.json.
 */
export function saveAssetsTable(assets: Asset[]) {
  fs.writeFileSync(assetsTablePath, JSON.stringify(assets, null, 2));
}

/**
 * Check assets table and throw warning if some local images are not uploaded.
 */
export function checkAssets(assets: Asset[]) {
  assets.forEach(({ localPath, hostingUri }) => {
    if (!hostingUri) {
      logger.log(
        'warning',
        `${localPath} has not been uploaded. Please check your network connection.`,
      );
    }
  });
}

/**
 * The pure operation of uploading images.
 */
export function upload(localPath: string, callback: Function) {
  const formData = { file: fs.createReadStream(localPath) };

  request.post({ formData, url: IMAGE_HOSTING_URL }, (err, res, body) => {
    if (err) {
      return callback(new Error('Failed to make request. Retrying ...'));
    }

    const { success, data } = JSON.parse(body);
    if (!success) {
      return callback(new Error(`Upload failed for ${localPath}.`));
    }
    callback(null, data);
  });
}

/**
 * Upload a single image to image hosting.
 */
export function uploadSingle(localPath: string) {
  const newAsset: Asset = { localPath };
  if (isAssetsLocked()) {
    return;
  }

  createAssetsLock();
  const assets = loadAssetsTable();
  upload(localPath, (err: Error, data: string) => {
    if (!err) {
      logger.log('success', `Upload ${localPath} to ${data} successfully.`);
      newAsset.hostingUri = data;
    }
    assets.push(newAsset);
    saveAssetsTable(assets);

    // Unlock anyway.
    removeAssetsLock();
  });
}

/**
 * Synchronize all images, including uploading all local images
 * and download images from hosting sites.
 */
export function syncImages() {
  if (isAssetsLocked()) {
    logger.log(
      'warning',
      'tuture-assets.json is being read by another program.',
    );
    return;
  }

  createAssetsLock();
  const assets = loadAssetsTable();

  const syncTasks = assets
    .filter(
      ({ localPath, hostingUri }) => fs.existsSync(localPath) || hostingUri,
    )
    .map(
      ({ localPath, hostingUri }) =>
        new Promise<Asset>((resolve) => {
          // Missing on this machine, download from image hosting.
          if (!fs.existsSync(localPath)) {
            logger.log(
              'info',
              `Downloading from ${hostingUri} to ${localPath}.`,
            );

            if (!fs.existsSync(path.dirname(localPath))) {
              fs.mkdirpSync(path.dirname(localPath));
            }

            return setTimeout(() => {
              request
                .get(hostingUri as string)
                .pipe(fs.createWriteStream(localPath));

              resolve({ localPath, hostingUri } as Asset);
            }, Math.random() * 1000);
          }

          // Not uploaded yet, trying to upload.
          if (!hostingUri) {
            return upload(localPath, (err: Error, data: string) => {
              if (err) {
                return resolve({ localPath } as Asset);
              }
              logger.log(
                'success',
                `Upload ${localPath} to ${data} successfully.`,
              );
              resolve({ localPath, hostingUri: data } as Asset);
            });
          }

          resolve({ localPath, hostingUri } as Asset);
        }),
    );

  Promise.all(syncTasks)
    .then((syncedAssets) => {
      // Save synced assets table if updated.
      if (JSON.stringify(assets) !== JSON.stringify(syncedAssets)) {
        saveAssetsTable(syncedAssets);
        logger.log('success', 'Synchronized assets table.');
      }
      removeAssetsLock();
    })
    .catch((err) => {
      logger.log('error', err.message);
      removeAssetsLock();
    });
}
