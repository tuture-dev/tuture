import fs from 'fs-extra';
import path from 'path';
import {
  INode,
  Collection,
  TUTURE_ROOT,
  TUTURE_VCS_ROOT,
  COLLECTION_PATH,
  TUTURE_DOC_ROOT,
  COLLECTION_CHECKPOINT,
  SCHEMA_VERSION,
  convertV1ToV2,
  StepDoc,
} from '@tuture/core';

export const collectionPath = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  COLLECTION_PATH,
);

export const tutureDocRoot = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  TUTURE_DOC_ROOT,
);

export const collectionCheckpoint = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  COLLECTION_CHECKPOINT,
);

export const collectionVcsPath = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_VCS_ROOT,
  COLLECTION_PATH,
);

/**
 * Load collection.
 */
export function loadCollection(): Collection {
  let collection = fs.readJSONSync(collectionPath);

  if (collection.version !== 'v1' && collection.version !== SCHEMA_VERSION) {
    throw new Error(
      'incompatible collection version, please contact mrc@mail.tuture.co to fix it',
    );
  }

  if (collection.version === 'v1') {
    let [collectionV2, stepDocs] = convertV1ToV2(collection);
    collection = collectionV2;
    collection.version = SCHEMA_VERSION;

    Object.entries(stepDocs).forEach(([id, doc]) => saveStepSync(id, doc));
  }

  return collection;
}

/**
 * Save the entire collection back to workspace.
 */
export function saveCollection(collection: Collection) {
  collection.version = SCHEMA_VERSION;
  fs.outputJSONSync(collectionPath, collection, { spaces: 2 });
}

export function saveCheckpoint() {
  // Copy the last committed file.
  fs.copySync(collectionPath, collectionCheckpoint, { overwrite: true });
}

export function hasCollectionChangedSinceCheckpoint() {
  if (!fs.existsSync(collectionCheckpoint)) {
    return true;
  }
  return !fs
    .readFileSync(collectionPath)
    .equals(fs.readFileSync(collectionCheckpoint));
}

function getStepDocPath(id: string): string {
  return path.join(tutureDocRoot, `${id}.json`);
}

/**
 * Read given step from workspace.
 * @param id step id
 * @returns doc for this step
 */
export async function loadStep(id: string): Promise<StepDoc> {
  return fs.readJSON(getStepDocPath(id));
}

/**
 * Read given step from workspace, synchronously.
 * @param id step id
 * @returns doc for this step
 */
export function loadStepSync(id: string): StepDoc {
  return fs.readJsonSync(getStepDocPath(id));
}

/**
 * Save step nodes to json doc synchronously.
 * If the step doc already exists, update it. Otherwise create a new doc.
 * @param id step id
 * @param doc prosemirror node for this step
 */
export function saveStepSync(id: string, doc: StepDoc) {
  const docPath = path.join(tutureDocRoot, `${id}.json`);
  fs.outputJsonSync(docPath, doc, { spaces: 2 });
}
