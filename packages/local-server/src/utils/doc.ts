import * as Y from 'yjs';
import { tutureSchema } from '@tuture/core';
import { LeveldbPersistence } from 'y-leveldb';
import { prosemirrorJSONToYDoc } from 'y-prosemirror';

import { getDocsRoot } from './path.js';

let ldb: LeveldbPersistence | null;

function getLdb() {
  ldb = ldb || new LeveldbPersistence(getDocsRoot());
  return ldb;
}

export function saveDoc(doc: any) {
  const yDoc = prosemirrorJSONToYDoc(tutureSchema as any, doc);
  getLdb().storeUpdate(doc.attrs.id, Y.encodeStateAsUpdate(yDoc));
}

export function deleteDoc(docId: string) {
  getLdb().clearDocument(docId);
}
