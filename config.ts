import os from 'os';
import fs from 'fs-extra';
import path from 'path';

import { TutureConfig } from './types';

export const TUTURE_YML_PATH = 'tuture.yml';

// Directory which houses tuture internal files.
export const TUTURE_ROOT = '.tuture';

export const DIFF_PATH = path.join(TUTURE_ROOT, 'diff.json');

// Editor path
export const EDITOR_PATH = path.join(__dirname, 'editor');

export const EDITOR_STATIC_PATH = path.join(EDITOR_PATH, 'static');

// Path to runtime config file.
export const CONFIG_PATH = path.join(TUTURE_ROOT, 'config.json');

export const GLOBAL_TUTURE_ROOT = path.join(os.homedir(), TUTURE_ROOT);

export const TOKEN_PATH = path.join(GLOBAL_TUTURE_ROOT, 'token');

// API endpoint of tuture.co.
export const GRAPHQL_SERVER = 'https://gql.tuture.co';
export const FILE_UPLOAD_API = 'https://gql.tuture.co/upload';

export const STATIC_SERVER = 'https://static.tuture.co/';

export function loadConfig(): TutureConfig {
  return JSON.parse(fs.readFileSync(CONFIG_PATH).toString());
}

// Default config of Tuture.
export default {
  // Files that should be commited but won't be tracked by Tuture.
  ignoredFiles: [
    // Git-related files
    '.gitignore',
    '.gitattributes',

    // Node.js
    'package-lock.json',
    'yarn.lock',

    // Tuture-related files
    'tuture.yml',
  ],

  // Port to use for tuture-server.
  port: 3000,
};
