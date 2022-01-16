import { Router, Request } from 'express';
import { Article, randHex } from '@tuture/core';

import { loadCollection, saveCollection } from '../utils/collection';

export function createArticlesRouter() {
  const router = Router();

  router.get('/', (_, res) => {
    const { articles } = loadCollection('');
    res.json(articles);
  });

  router.post('/create', (req, res) => {
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
    const collection = loadCollection('');
    collection.articles.push(newArticle);
    saveCollection(collection);
    return res.status(201).json(newArticle);
  });

  router.delete('/:articleId', (req, res) => {
    const { articleId } = req.params;
    const collection = loadCollection('');
    const deleteIndex = collection.articles.findIndex(
      (article) => article.id === articleId,
    );
    if (deleteIndex === -1) {
      return res.sendStatus(404);
    }
    collection.articles.splice(deleteIndex, 1);
    res.sendStatus(200);
  });

  return router;
}
