import { Router } from 'express';

import { loadArticle, loadCollection, saveArticle } from '../utils/collection';
import TaskQueue from '../utils/task-queue';

export function createArticlesRouter(queue: TaskQueue) {
  const router = Router();

  router.get('/', (_, res) => {
    const { articles } = loadCollection();
    res.json(articles);
  });

  router.put('/', (req, res) => {
    queue.addTask((c) => ({ ...c, articles: req.body }), 0);
    res.sendStatus(200);
  });

  router.get('/:articleId', (req, res) => {
    const { articleId } = req.params;
    res.json(loadArticle(articleId));
  });

  router.put('/:articleId', (req, res) => {
    const { articleId } = req.params;
    saveArticle(articleId, req.body);
    res.sendStatus(200);
  });

  router.delete('/:articleId', (req, res) => {
    const { articleId } = req.params;

    queue.addTask((c) => {
      const { articles } = c;
      return {
        ...c,
        articles: articles.filter((article) => article.id !== articleId),
      };
    }, 0);

    res.sendStatus(200);
  });

  return router;
}
