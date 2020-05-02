import { Router } from 'express';
import cp from 'child_process';

import { createArticlesRouter } from './articles';
import { createCollectionStepsRouter } from './collection-steps';
import { createDiffRouter } from './diff';
import { createFragmentRouter } from './fragment';
import { createMetaRouter } from './meta';
import { createRemotesRouter } from './remotes';
import { createTocRouter } from './toc';
import TaskQueue from '../utils/task-queue';

export function createBaseRouter(queue: TaskQueue) {
  const router = Router();

  router.use('/articles', createArticlesRouter(queue));
  router.use('/collection-steps', createCollectionStepsRouter(queue));
  router.use('/diff', createDiffRouter());
  router.use('/fragment', createFragmentRouter(queue));
  router.use('/meta', createMetaRouter(queue));
  router.use('/remotes', createRemotesRouter(queue));
  router.use('/toc', createTocRouter(queue));

  router.get('/sync', async (req, res) => {
    cp.execFile('tuture', ['sync'], {}, (err) => {
      if (err) {
        res.status(500).json({ exitCode: err.code });
      } else {
        res.sendStatus(200);
      }
    });
  });

  return router;
}
