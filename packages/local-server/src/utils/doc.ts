import path from 'path';
import { tutureSchema } from '@tuture/core';

import Y from 'yjs';
import { LeveldbPersistence } from 'y-leveldb';
import { prosemirrorJSONToYDoc } from 'y-prosemirror';

import { docsRoot } from './path';
import { ensureDirSync } from 'fs-extra';

export function saveDoc(doc: any) {
  const docRoot = path.join(docsRoot, doc.attrs.id);
  ensureDirSync(docRoot);

  const persistence = new LeveldbPersistence(docRoot);
  const yDoc = prosemirrorJSONToYDoc(tutureSchema as any, doc);
  persistence.storeUpdate(doc.attrs.id, Y.encodeStateAsUpdate(yDoc));
}
