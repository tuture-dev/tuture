import path from 'path';
import { TUTURE_ROOT } from './constants';

export default {
  // Directory to store assets temporarily.
  assetsRoot: path.join(TUTURE_ROOT, 'assets'),

  // Time interval to synchronize all assets.
  assetsSyncInterval: 10000,

  // Path to build outputs.
  buildPath: path.join(TUTURE_ROOT, 'build'),

  // Port to use for tuture-server.
  port: 3013,

  // Files that should be commited but won't be tracked by Tuture.
  ignoredFiles: [
    // Git-related files
    '.gitignore',
    '.gitattributes',

    // Tuture-related files
    '.tuturerc',
    '.tutureignore',
  ],
};
