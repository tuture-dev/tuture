import { Router } from 'express';
import pick from 'lodash.pick';
import { Collection } from '@tuture/core';

import TaskQueue from '../utils/task-queue';

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

export function createMetaRouter(queue: TaskQueue) {
  const router = Router();

  router.get('/', (_, res) => {
    const collection = queue.readCollection();
    res.json(getCollectionMeta(collection));
  });

  router.put('/', (req, res) => {
    queue.addTask((c) => ({ ...c, ...req.body }), 0);
    res.sendStatus(200);
  });

  return router;
}
