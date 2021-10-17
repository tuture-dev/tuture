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
  StepAttrs,
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

    Object.entries(stepDocs).forEach(([stepId, doc]) =>
      saveStepSync(stepId, doc),
    );
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

/**
 * Read article from workspace.
 * @param articleId article id
 * @returns the parsed doc
 */
export function loadArticle(articleId: string): INode {
  return fs.readJSONSync(path.join(tutureDocRoot, `${articleId}.json`));
}

/**
 * Save article nodes to json doc.
 * @param articleId article id
 * @param nodes prosemirror nodes for this article
 */
export function saveArticle(articleId: string, doc: INode) {
  const docPath = path.join(tutureDocRoot, `${articleId}.json`);
  fs.outputJSONSync(docPath, doc, { spaces: 2 });
}

function getStepDocPath(stepId: string): string {
  return path.join(tutureDocRoot, `${stepId}.json`);
}

/**
 * Read given step from workspace.
 * @param stepId step id
 * @returns doc for this step
 */
export async function loadStep(stepId: string): Promise<StepDoc> {
  return fs.readJSON(getStepDocPath(stepId));
}

/**
 * Read given step from workspace, synchronously.
 * @param stepId step id
 * @returns doc for this step
 */
export function loadStepSync(stepId: string): StepDoc {
  return fs.readJsonSync(getStepDocPath(stepId));
}

/**
 * Save step nodes to json doc synchronously.
 * If the step doc already exists, update it. Otherwise create a new doc.
 * @param stepId step id
 * @param doc prosemirror node for this step
 */
export function saveStepSync(stepId: string, doc: StepDoc) {
  const docPath = path.join(tutureDocRoot, `${stepId}.json`);
  fs.outputJsonSync(docPath, doc, { spaces: 2 });
}
