import debug from 'debug';
import * as Y from 'yjs';
import { tutureSchema } from '@tuture/core';
import { LeveldbPersistence } from 'y-leveldb';
import { prosemirrorJSONToYDoc } from 'y-prosemirror';

import { getDocsRoot } from './path.js';

const d = debug('tuture:local-server:doc');

export function getDocPersistence() {
  return new LeveldbPersistence(getDocsRoot());
}

export async function saveDoc(doc: any) {
  const docId = doc.attrs.id;
  if (!docId) {
    throw new Error('cannot save doc with empty id attribute');
  }
  const yDoc = prosemirrorJSONToYDoc(tutureSchema as any, doc);
  d('saveDoc id %s, content: %o', docId, yDoc.toJSON());

  const ldb = getDocPersistence();
  await ldb.storeUpdate(docId, Y.encodeStateAsUpdate(yDoc));
  await ldb.destroy();
}

export async function deleteDoc(docId: string) {
  const ldb = getDocPersistence();
  await ldb.clearDocument(docId);
  await ldb.destroy();
}
