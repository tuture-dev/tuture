import fs from 'fs-extra';
import path from 'path';

import { TUTURE_ROOT, TUTURE_VCS_ROOT, ASSETS_JSON_PATH } from '@tuture/core';

export interface Asset {
  localPath: string;
  hostingUri?: string;
}

export const assetsTablePath = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  ASSETS_JSON_PATH,
);

export const assetsTableVcsPath = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_VCS_ROOT,
  ASSETS_JSON_PATH,
);

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
