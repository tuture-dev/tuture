import pick from 'lodash.pick';
import { Router } from 'express';
import { Collection } from '@tuture/core';

import { getCollectionDb } from '../utils/index.js';

function getCollectionMeta(collection: Collection) {
  return pick(collection, [
    'name',
    'description',
    'id',
    'created',
    'topics',
    'categories',
    'github',
  ]);
}

const router = Router();

router.get('/', (_, res) => {
  const db = getCollectionDb();
  res.json(getCollectionMeta(db.data!));
});

router.put('/', (req, res) => {
  const db = getCollectionDb(req.params.collectionId);
  db.data = { ...db.data, ...req.body };
  db.write();
  res.sendStatus(200);
});

export default router;
