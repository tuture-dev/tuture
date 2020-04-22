import { Router } from 'express';
import { getStepTitle } from '@tuture/core';
import pick from 'lodash.pick';

import { TocStepItem, TocItem, TocArticleItem } from '../types';
import TaskQueue from '../utils/task-queue';

interface TocUpdateBody {
  articleStepList: TocItem[];
  unassignedStepList: TocStepItem[];
  needDeleteOutdatedStepList: string[];
}

export function createTocRouter(queue: TaskQueue) {
  const router = Router();

  router.get('/', (_, res) => {
    const { articles = [], steps = [] } = queue.readCollection();

    const articleStepList = articles.reduce<TocItem[]>(
      (initialArticleStepList, nowArticle) => {
        const articleItem: TocArticleItem = {
          ...pick(nowArticle, ['id', 'name']),
          type: 'article',
          level: 0,
        };
        const stepList: TocStepItem[] = steps
          .filter((step) => step.articleId === nowArticle.id)
          .map((step) => ({
            ...pick(step, ['id', 'articleId', 'outdated']),
            type: 'step',
            level: 1,
            number: steps.findIndex(({ id }) => step.id === id),
            name: getStepTitle(step),
          }));

        return initialArticleStepList.concat(articleItem, ...stepList);
      },
      [],
    );

    const unassignedStepList = steps
      .filter((step) => !step.articleId)
      .map((step) => ({
        id: step.id,
        outdated: step.outdated,
        level: 1,
        number: steps.findIndex(({ id }) => step.id === id),
        name: getStepTitle(step),
      }));

    res.json({ articleStepList, unassignedStepList });
  });

  router.put('/', (req, res) => {
    const {
      articleStepList,
      unassignedStepList,
      needDeleteOutdatedStepList,
    }: TocUpdateBody = req.body;

    queue.addTask((c) => {
      let { steps, articles } = c;

      // handle article deletion
      const validArticles = articleStepList
        .filter((item) => item.type === 'article')
        .map((item) => item.id);
      articles = articles.filter(({ id }) => validArticles.includes(id));

      // handle step allocation
      const nowAllocationStepList = articleStepList.filter(
        (item) => item.type === 'step' && item.articleId,
      );
      const nowAllocationStepIdList = nowAllocationStepList.map(
        (item) => item.id,
      );
      const unassignedStepIdList = unassignedStepList.map((step) => step.id);

      steps = steps
        .map((step) => {
          if (nowAllocationStepIdList.includes(step.id)) {
            step.articleId = (nowAllocationStepList.filter(
              (item) => item.id === step.id,
            )[0] as TocStepItem).articleId;
          }
          if (unassignedStepIdList.includes(step.id)) {
            step.articleId = null;
          }
          return step;
        })
        .filter((step) => !needDeleteOutdatedStepList.includes(step.id));

      return { ...c, articles, steps };
    });

    res.sendStatus(200);
  });

  return router;
}
