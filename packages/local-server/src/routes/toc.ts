import { Router } from 'express';
import { INode, getNodeText } from '@tuture/core';

import TaskQueue from '../utils/task-queue';
import { TocStepItem, TocArticleItem, TocItem } from '../types';
import {
  loadCollection,
  loadArticle,
  loadUnassignedSteps,
} from '../utils/collection';

interface TocUpdateBody {
  articleStepList: TocItem[];
  unassignedStepList: TocStepItem[];
  needDeleteOutdatedStepList: string[];
}

export function createTocRouter(queue: TaskQueue) {
  const router = Router();

  router.get('/', (_, res) => {
    const { articles = [] } = loadCollection();

    const articleStepList: TocItem[] = [];
    const unassignedStepList: TocItem[] = [];

    let stepCounter = 0;
    for (let article of articles) {
      const articleItem: TocArticleItem = {
        ...article,
        type: 'article',
      };
      articleStepList.push(articleItem);

      const nodes: INode[] = loadArticle(articleItem.id).content!;
      for (let node of nodes) {
        if (node.type === 'heading' && node.attrs?.step) {
          const stepItem: TocStepItem = {
            type: 'step',
            id: node.attrs.step.id,
            articleId: article.id,
            outdated: node.attrs.outdated,
            number: stepCounter++,
            name: getNodeText(node),
          };
          articleStepList.push(stepItem);
        }
      }
    }

    const unassignedSteps = loadUnassignedSteps();
    for (let node of unassignedSteps) {
      if (node.type === 'heading' && node.attrs?.step) {
        const stepItem: TocStepItem = {
          type: 'step',
          id: node.attrs.step.id,
          articleId: '',
          outdated: node.attrs.outdated,
          number: stepCounter++,
          name: getNodeText(node),
        };
        unassignedStepList.push(stepItem);
      }
    }

    res.json({ articleStepList, unassignedStepList });
  });

  router.put('/', (req, res) => {
    const {
      articleStepList,
      unassignedStepList,
      needDeleteOutdatedStepList,
    }: TocUpdateBody = req.body;

    // queue.addTask((c) => {
    //   let { steps, articles } = c;

    //   // handle article deletion
    //   const validArticles = articleStepList
    //     .filter((item) => item.type === 'article')
    //     .map((item) => item.id);
    //   articles = articles.filter(({ id }) => validArticles.includes(id));

    //   // handle step allocation
    //   const nowAllocationStepList = articleStepList.filter(
    //     (item) => item.type === 'step',
    //   ) as TocStepItem[];
    //   const nowAllocationStepIdList = nowAllocationStepList.map(
    //     (item) => item.id,
    //   );
    //   const unassignedStepIdList = unassignedStepList.map((step) => step.id);

    //   steps = steps
    //     .map((step) => {
    //       if (nowAllocationStepIdList.includes(step.id)) {
    //         step.articleId = nowAllocationStepList.filter(
    //           (item) => item.id === step.id,
    //         )[0].articleId;
    //       }
    //       if (unassignedStepIdList.includes(step.id)) {
    //         step.articleId = null;
    //       }
    //       return step;
    //     })
    //     .filter((step) => !needDeleteOutdatedStepList.includes(step.id));

    //   return { ...c, articles, steps };
    // });

    res.sendStatus(200);
  });

  return router;
}
