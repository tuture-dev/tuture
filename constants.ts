import path from 'path';

export const COLLECTION_PATH = 'collection.json';

export const COLLECTION_CHECKPOINT = 'collection.last-committed.json';

export const ASSETS_JSON_PATH = 'tuture-assets.json';

export const ASSETS_JSON_CHECKPOINT = 'tuture-assets.last-committed.json';

export const TUTURE_IGNORE_PATH = '.tutureignore';

// Directory which houses tuture internal files.
export const TUTURE_ROOT = '.tuture';

export const DIFF_PATH = path.join(TUTURE_ROOT, 'diff.json');

// Editor path
export const EDITOR_PATH = path.join(__dirname, 'editor');

export const EDITOR_STATIC_PATH = path.join(EDITOR_PATH, 'static');

export const TUTURE_COMMIT_PREFIX = 'tuture:';

export const IMAGE_HOSTING_URL = 'https://imgkr.com/api/files/upload';

// Branch for commiting tutorial content.
export const TUTURE_BRANCH = 'tuture';
