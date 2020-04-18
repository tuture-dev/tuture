'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs-extra'));
var path = _interopDefault(require('path'));
var core = require('@tuture/core');
var cp = _interopDefault(require('child_process'));
var logger = _interopDefault(require('morgan'));
var express = _interopDefault(require('express'));
var simplegit = _interopDefault(require('simple-git/promise'));

const assetsTablePath = path.join(process.env.TUTURE_PATH || process.cwd(), core.TUTURE_ROOT, core.ASSETS_JSON_PATH);
const assetsTableVcsPath = path.join(process.env.TUTURE_PATH || process.cwd(), core.TUTURE_VCS_ROOT, core.ASSETS_JSON_PATH);
/**
 * Load assets from tuture-assets.json.
 * If not present, return an empty array.
 */
function loadAssetsTable() {
    if (fs.existsSync(assetsTablePath)) {
        return JSON.parse(fs.readFileSync(assetsTablePath).toString());
    }
    return [];
}

const collectionPath = path.join(process.env.TUTURE_PATH || process.cwd(), core.TUTURE_ROOT, core.COLLECTION_PATH);
const collectionCheckpoint = path.join(process.env.TUTURE_PATH || process.cwd(), core.TUTURE_ROOT, core.COLLECTION_CHECKPOINT);
const collectionVcsPath = path.join(process.env.TUTURE_PATH || process.cwd(), core.TUTURE_VCS_ROOT, core.COLLECTION_PATH);
/**
 * Load collection.
 */
function loadCollection() {
    let rawCollection = fs.readFileSync(collectionPath).toString();
    const assetsTable = loadAssetsTable();
    // COMPAT: convert all asset paths
    assetsTable.forEach((asset) => {
        const { localPath, hostingUri } = asset;
        if (hostingUri) {
            rawCollection = rawCollection.replace(new RegExp(localPath, 'g'), hostingUri);
        }
    });
    const collection = JSON.parse(rawCollection);
    // COMPAT: convert hiddenLines field
    if (collection.version !== 'v1') {
        const convertHiddenLines = (hiddenLines) => {
            const rangeGroups = [];
            let startNumber = null;
            for (let i = 0; i < hiddenLines.length; i++) {
                const prev = hiddenLines[i - 1];
                const current = hiddenLines[i];
                const next = hiddenLines[i + 1];
                if (current !== prev + 1 && current !== next - 1) {
                    rangeGroups.push([current, current]);
                }
                else if (current !== prev + 1) {
                    startNumber = hiddenLines[i];
                }
                else if (current + 1 !== next) {
                    rangeGroups.push([startNumber, hiddenLines[i]]);
                }
            }
            return rangeGroups;
        };
        for (const step of collection.steps) {
            for (const node of step.children) {
                if (node.type === 'file') {
                    const diffBlock = node.children[1];
                    if (diffBlock.hiddenLines) {
                        diffBlock.hiddenLines = convertHiddenLines(diffBlock.hiddenLines);
                    }
                }
            }
        }
        collection.version = 'v1';
    }
    // COMPAT: normalize children of all diff blocks
    for (const step of collection.steps) {
        for (const node of step.children) {
            if (node.type === 'file') {
                const diffBlock = node.children[1];
                diffBlock.children = [{ text: '' }];
            }
        }
    }
    return collection;
}
/**
 * Save the entire collection back to workspace.
 */
function saveCollection(collection) {
    fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
}
function saveCheckpoint() {
    // Copy the last committed file.
    fs.copySync(collectionPath, collectionCheckpoint, { overwrite: true });
}
function hasCollectionChangedSinceCheckpoint() {
    if (!fs.existsSync(collectionCheckpoint)) {
        return true;
    }
    return !fs
        .readFileSync(collectionPath)
        .equals(fs.readFileSync(collectionCheckpoint));
}

// Editor path
const EDITOR_PATH = path.join(__dirname, 'editor');
const EDITOR_STATIC_PATH = path.join(EDITOR_PATH, 'static');
const workspace = process.env.TUTURE_PATH || process.cwd();
const diffPath = path.join(workspace, core.TUTURE_ROOT, core.DIFF_PATH);
const makeServer = () => {
    const app = express();
    const git = simplegit().silent(true);
    if (process.env.NODE_ENV === 'development') {
        app.use(logger('dev'));
    }
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: false }));
    app.use('/static', express.static(EDITOR_STATIC_PATH));
    app.get('/diff', (_, res) => {
        res.json(JSON.parse(fs.readFileSync(diffPath).toString()));
    });
    app.get('/collection', (_, res) => {
        res.json(loadCollection());
    });
    app.get('/remotes', (_, res) => {
        git
            .getRemotes(true)
            .then((remotes) => res.json(remotes))
            .catch((err) => res.status(500).json(err));
    });
    app.post('/save', (req, res) => {
        saveCollection(req.body);
        res.sendStatus(200);
    });
    app.get('/sync', async (req, res) => {
        cp.execFile('tuture', ['sync'], {}, (err) => {
            if (err) {
                res.status(500).json({ exitCode: err.code });
            }
            else {
                res.sendStatus(200);
            }
        });
    });
    app.get('*', (_, res) => {
        const html = fs
            .readFileSync(path.join(EDITOR_PATH, 'index.html'))
            .toString();
        res.send(html);
    });
    return app;
};

exports.assetsTablePath = assetsTablePath;
exports.assetsTableVcsPath = assetsTableVcsPath;
exports.collectionCheckpoint = collectionCheckpoint;
exports.collectionPath = collectionPath;
exports.collectionVcsPath = collectionVcsPath;
exports.hasCollectionChangedSinceCheckpoint = hasCollectionChangedSinceCheckpoint;
exports.loadAssetsTable = loadAssetsTable;
exports.loadCollection = loadCollection;
exports.makeServer = makeServer;
exports.saveCheckpoint = saveCheckpoint;
exports.saveCollection = saveCollection;
//# sourceMappingURL=index.js.map
