import path from 'path';

export const COLLECTION_PATH = 'collection.json';

export const COLLECTION_CHECKPOINT = 'collection.ckpt.json';

export const ASSETS_JSON_PATH = 'tuture-assets.json';

export const ASSETS_JSON_CHECKPOINT = 'tuture-assets.ckpt.json';

export const TUTURE_IGNORE_PATH = '.tutureignore';

// The workspace for storing tutorial-related data.
export const TUTURE_ROOT = '.tuture';

// Directory which houses tutorial data on VCS.
export const TUTURE_VCS_ROOT = '.tuture-committed';

export const DIFF_PATH = path.join(TUTURE_ROOT, 'diff.json');

// Editor path
export const EDITOR_PATH = path.join(__dirname, 'editor');

export const EDITOR_STATIC_PATH = path.join(EDITOR_PATH, 'static');

export const TUTURE_COMMIT_PREFIX = 'tuture:';

export const IMAGE_HOSTING_URL = 'https://imgkr.com/api/files/upload';

// Branch for commiting tutorial content.
export const TUTURE_BRANCH = 'tuture';

export enum EXIT_CODE {
  NOT_INIT = 1,
  NO_STAGE,
  NO_REMOTE,
  CONFLICT,
}
