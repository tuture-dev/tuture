import { Router } from 'express';
import { getHeadings, Article } from '@tuture/core';

import TaskQueue from '../utils/task-queue';
import { CollectionStep } from '../types';

export function createCollectionStepsRouter(queue: TaskQueue) {
  const router = Router();

  router.get('/', (_, res) => {
    const { steps, articles } = queue.readCollection();

    const getArticleIndexAndName = (articleId: string, articles: Article[]) => {
      let targetArticleIndex = 0;
      const targetArticle = articles.filter((article, index) => {
        if (article.id === articleId) {
          targetArticleIndex = index;
          return true;
        }
        return false;
      })[0];

      return {
        articleIndex: targetArticleIndex,
        articleName: targetArticle?.name || '',
      };
    };

    const collectionSteps = steps.map((step, index) => ({
      key: String(index),
      id: step.id,
      articleId: step.articleId,
      title: getHeadings([step])[0].title,
      ...getArticleIndexAndName(step.articleId || '', articles),
    })) as CollectionStep[];

    res.json(collectionSteps);
  });

  return router;
}
