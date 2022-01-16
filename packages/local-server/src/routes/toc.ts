import { Router } from 'express';

import { TocStepItem, TocArticleItem, TocItem } from '../types';
import { loadCollection, saveCollection } from '../utils/collection';

interface TocUpdateBody {
  articleStepList: TocItem[];
  unassignedStepList: TocStepItem[];
}

export function createTocRouter() {
  const router = Router();

  router.get('/', (_, res) => {
    // const { articles = [], unassignedSteps = [] } = loadCollection();

    const articleStepList: TocItem[] = [];
    const unassignedStepList: TocItem[] = [];

    // for (let article of articles) {
    //   const articleItem: TocArticleItem = {
    //     ...article,
    //     type: 'article',
    //   };
    //   articleStepList.push(articleItem);

    //   for (let step of article.steps) {
    //     const stepDoc = loadStepSync(step.id);
    //     const stepItem: TocStepItem = {
    //       type: 'step',
    //       ...stepDoc.attrs,
    //     };
    //     articleStepList.push(stepItem);
    //   }
    // }

    // for (let step of unassignedSteps) {
    //   const stepDoc = loadStepSync(step.id);
    //   const stepItem: TocStepItem = {
    //     type: 'step',
    //     ...stepDoc.attrs,
    //   };
    //   unassignedStepList.push(stepItem);
    // }

    res.json({ articleStepList, unassignedStepList });
  });

  router.put('/', (req, res) => {
    const {
      articleStepList = [],
      unassignedStepList = [],
    }: TocUpdateBody = req.body;

    // const collection = loadCollection();
    // const articles = collection.articles;
    // for (let i = 0; i < articles.length; i++) {
    //   articles[i].steps = [];
    // }

    // articleStepList.forEach((articleStep) => {
    //   if (articleStep.type === 'step') {
    //     for (let i = 0; i < articles.length; i++) {
    //       if (articles[i].id === articleStep.articleId) {
    //         articles[i].steps.push({
    //           id: articleStep.id,
    //           commit: articleStep.commit,
    //         });
    //       }
    //     }
    //   }
    // });

    // collection.unassignedSteps = unassignedStepList.map((step) => ({
    //   id: step.id,
    //   commit: step.commit,
    // }));

    // saveCollection(collection);

    res.sendStatus(200);
  });

  return router;
}
