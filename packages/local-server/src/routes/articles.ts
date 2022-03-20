import { Router } from 'express';
import { Article, randHex } from '@tuture/core';

import { getCollectionDb } from '../utils/index.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const db = await getCollectionDb(req.params.collectionId);
    res.json(db.data!.articles);
  } catch (err) {
    next(err);
  }
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
  const db = await getCollectionDb(req.params.collectionId);
  const deleteIndex = db.data!.articles.findIndex(
    (article) => article.id === articleId,
  );
  if (deleteIndex === -1) {
    return res.sendStatus(404);
  }
  db.data!.articles.splice(deleteIndex, 1);
  await db.write();
  res.sendStatus(204);
});

export default router;
