import { Router, Request } from 'express';
import { Article, randHex } from '@tuture/core';

import {
  saveCollection,
  getCollectionDb,
  loadCollection,
} from '../utils/index.js';

const router = Router();

router.get('/', async (req, res) => {
  const db = await getCollectionDb(req.params.collectionId);
  res.json(db.data!.articles);
});

router.post('/create', async (req, res) => {
  const newArticle: Article = {
    id: randHex(32),
    name: '',
    description: '',
    created: new Date(),
    cover: '',
    topics: [],
    categories: [],
    steps: [],
    ...req.body,
  };
  const db = await getCollectionDb(req.params.collectionId);
  db.data!.articles.push(newArticle);
  await db.write();
  return res.status(201).json(newArticle);
});

router.delete('/:articleId', async (req, res) => {
  const { articleId } = req.params;
  const collection = await loadCollection(req.params.collectionId);
  const deleteIndex = collection.articles.findIndex(
    (article) => article.id === articleId,
  );
  if (deleteIndex === -1) {
    return res.sendStatus(404);
  }
  collection.articles.splice(deleteIndex, 1);
  res.sendStatus(200);
});

export default router;
