import { Router } from 'express';
import { Article, randHex } from '@tuture/core';

import { getCollectionDb } from '../utils/index.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getCollectionDb(req.params.collectionId);
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
  const db = getCollectionDb(req.params.collectionId);
  db.data!.articles.push(newArticle);
  db.write();
  return res.status(201).json(newArticle);
});

router.delete('/:articleId', (req, res) => {
  const { articleId } = req.params;
  const db = getCollectionDb(req.params.collectionId);
  const deleteIndex = db.data!.articles.findIndex(
    (article) => article.id === articleId,
  );
  if (deleteIndex === -1) {
    return res.sendStatus(404);
  }
  db.data!.articles.splice(deleteIndex, 1);
  db.write();
  res.sendStatus(204);
});

export default router;
