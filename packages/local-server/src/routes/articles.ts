import { Router } from 'express';
import { Article, randHex } from '@tuture/core';

import { loadCollection, saveCollection, loadStep } from '../utils/collection';

export function createArticlesRouter() {
  const router = Router();

  router.get('/', (_, res) => {
    const { articles } = loadCollection();
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
    const collection = loadCollection();
    collection.articles.push(newArticle);
    saveCollection(collection);
    return res.status(201).json(newArticle);
  });

  router.get('/:articleId', async (req, res) => {
    const { articleId } = req.params;
    const { articles } = loadCollection();
    const article = articles.filter((article) => article.id === articleId)[0];
    if (!article) {
      return res.sendStatus(404);
    }
    const steps = await Promise.all(
      article.steps.map((step) => loadStep(step.id)),
    );
    res.json({
      type: 'doc',
      content: steps.flatMap((step) => step.content),
    });
  });

  router.put('/:articleId', (req, res) => {
    const { articleId } = req.params;
    const collection = loadCollection();
    for (let i = 0; i < collection.articles.length; i++) {
      const article = collection.articles[i];
      if (article.id === articleId) {
        collection.articles[i] = { ...article, ...req.body };
        saveCollection(collection);
        break;
      }
    }
    res.sendStatus(200);
  });

  router.delete('/:articleId', (req, res) => {
    const { articleId } = req.params;
    const collection = loadCollection();
    const deleteIndex = collection.articles.findIndex(
      (article) => article.id === articleId,
    );
    if (deleteIndex === -1) {
      return res.sendStatus(404);
    }
    collection.unassignedSteps.push(...collection.articles[deleteIndex].steps);
    collection.articles.splice(deleteIndex, 1);
    res.sendStatus(200);
  });

  return router;
}
