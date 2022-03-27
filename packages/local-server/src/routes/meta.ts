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

router.get('/', async (_, res) => {
  const db = await getCollectionDb();
  res.json(getCollectionMeta(db.data!));
});

router.put('/', async (req, res) => {
  const db = await getCollectionDb(req.params.collectionId);
  db.data = { ...db.data, ...req.body };
  await db.write();
  res.sendStatus(200);
});

export default router;
