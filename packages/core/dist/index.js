'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const COLLECTION_PATH = 'collection.json';
const COLLECTION_CHECKPOINT = 'collection.ckpt.json';
const ASSETS_JSON_PATH = 'tuture-assets.json';
const TUTURE_IGNORE_PATH = '.tutureignore';
// The workspace for storing tutorial-related data.
const TUTURE_ROOT = '.tuture';
// Directory which houses tutorial data on VCS.
const TUTURE_VCS_ROOT = '.tuture-committed';
const DIFF_PATH = 'diff.json';
const TUTURE_COMMIT_PREFIX = 'tuture:';
// Branch for commiting tutorial content.
const TUTURE_BRANCH = 'tuture';

/**
 * Generate a random hex number.
 */
function randHex(digits = 8) {
    return Math.random()
        .toString(16)
        .slice(2, digits + 2);
}

exports.ASSETS_JSON_PATH = ASSETS_JSON_PATH;
exports.COLLECTION_CHECKPOINT = COLLECTION_CHECKPOINT;
exports.COLLECTION_PATH = COLLECTION_PATH;
exports.DIFF_PATH = DIFF_PATH;
exports.TUTURE_BRANCH = TUTURE_BRANCH;
exports.TUTURE_COMMIT_PREFIX = TUTURE_COMMIT_PREFIX;
exports.TUTURE_IGNORE_PATH = TUTURE_IGNORE_PATH;
exports.TUTURE_ROOT = TUTURE_ROOT;
exports.TUTURE_VCS_ROOT = TUTURE_VCS_ROOT;
exports.randHex = randHex;
//# sourceMappingURL=index.js.map
