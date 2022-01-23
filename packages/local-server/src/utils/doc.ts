import path from 'path';
import * as Y from 'yjs';
import fs from 'fs-extra';
import { tutureSchema } from '@tuture/core';
import { LeveldbPersistence } from 'y-leveldb';
import { prosemirrorJSONToYDoc } from 'y-prosemirror';

import { docsRoot } from './path.js';

export function saveDoc(doc: any) {
  const docRoot = path.join(docsRoot, doc.attrs.id);
  fs.ensureDirSync(docRoot);

  const persistence = new LeveldbPersistence(docRoot);
  const yDoc = prosemirrorJSONToYDoc(tutureSchema as any, doc);
  persistence.storeUpdate(doc.attrs.id, Y.encodeStateAsUpdate(yDoc));
}
