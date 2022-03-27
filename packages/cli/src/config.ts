import * as path from 'path';

export default {
  // Time interval to synchronize all assets.
  assetsSyncInterval: 10000,

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
