import path from 'path';

export const TUTURE_YML_PATH = 'tuture.yml';

export const TUTURE_IGNORE_PATH = '.tutureignore';

// Directory which houses tuture internal files.
export const TUTURE_ROOT = '.tuture';

export const DIFF_PATH = path.join(TUTURE_ROOT, 'diff.json');

// Editor path
export const EDITOR_PATH = path.join(__dirname, 'editor');

export const EDITOR_STATIC_PATH = path.join(EDITOR_PATH, 'static');

export const TUTURE_COMMIT_PREFIX = 'tuture:';
