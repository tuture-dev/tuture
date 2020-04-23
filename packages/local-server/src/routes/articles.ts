import { Router } from 'express';

import TaskQueue from '../utils/task-queue';

export function createArticlesRouter(queue: TaskQueue) {
  const router = Router();

  router.get('/', (_, res) => {
    const { articles } = queue.readCollection();
    res.json(articles);
  });

  router.put('/', (req, res) => {
    queue.addTask((c) => ({ ...c, articles: req.body }), 0);
    res.sendStatus(200);
  });

  router.get('/:articleId', (req, res) => {
    const { articleId } = req.params;
    const { articles } = queue.readCollection();
    const article = articles.filter(({ id }) => articleId === id);

    res.json(article);
  });

  router.delete('/:articleId', (req, res) => {
    const { articleId } = req.params;

    queue.addTask((c) => {
      const { articles, steps } = c;
      return {
        ...c,
        articles: articles.filter((article) => article.id !== articleId),
        steps: steps.map((step) =>
          step.articleId === articleId ? { ...step, articleId: null } : step,
        ),
      };
    }, 0);

    res.sendStatus(200);
  });

  return router;
}
