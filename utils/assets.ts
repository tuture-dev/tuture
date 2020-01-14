import fs from 'fs-extra';
import path from 'path';
import request from 'request';

import logger from './logger';
import { TUTURE_ROOT, IMAGE_HOSTING_URL, ASSETS_JSON_PATH } from '../constants';

interface Asset {
  localPath: string;
  hostingUri?: string;
}

const assetsTablePath = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  ASSETS_JSON_PATH,
);

// A dead simple mutex lock.
let locked = false;

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
  if (locked) {
    return;
  }

  locked = true;
  const assets = loadAssetsTable();
  upload(localPath, (err: Error, data: string) => {
    if (!err) {
      logger.log('success', `Upload ${localPath} to ${data} successfully.`);
      newAsset.hostingUri = data;
    }
    assets.push(newAsset);
    saveAssetsTable(assets);

    // Unlock anyway.
    locked = false;
  });
}

/**
 * Synchronize all images, including uploading all local images
 * and download images from hosting sites.
 */
export function syncImages() {
  if (locked) return;

  locked = true;
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

            return request
              .get(hostingUri as string)
              .pipe(fs.createWriteStream(localPath));
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

  Promise.all(syncTasks).then((syncedAssets) => {
    // Save synced assets table if updated.
    if (JSON.stringify(assets) !== JSON.stringify(syncedAssets)) {
      saveAssetsTable(syncedAssets);
      logger.log('success', 'Synchronized assets table.');
    }
    locked = false;
  });
}
