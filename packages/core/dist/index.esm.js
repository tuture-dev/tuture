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

export { ASSETS_JSON_PATH, COLLECTION_CHECKPOINT, COLLECTION_PATH, DIFF_PATH, TUTURE_BRANCH, TUTURE_COMMIT_PREFIX, TUTURE_IGNORE_PATH, TUTURE_ROOT, TUTURE_VCS_ROOT, randHex };
//# sourceMappingURL=index.esm.js.map
