import { Router } from 'express';
import cp from 'child_process';

import { createArticlesRouter } from './articles';
import { createDiffRouter } from './diff';
import { createMetaRouter } from './meta';
import { createRemotesRouter } from './remotes';
import { createUploadRouter } from './upload';
import { createTocRouter } from './toc';
import TaskQueue from '../utils/task-queue';

export function createBaseRouter(queue: TaskQueue) {
  const router = Router();

  router.use('/articles', createArticlesRouter());
  router.use('/diff', createDiffRouter());
  router.use('/meta', createMetaRouter(queue));
  router.use('/remotes', createRemotesRouter(queue));
  router.use('/upload', createUploadRouter());
  router.use('/toc', createTocRouter());

  router.get('/sync', async (req, res) => {
    cp.execFile('tuture', ['sync'], {}, (err) => {
      if (err) {
        res.status(500).json({ code: err.code, message: err.message });
      } else {
        res.sendStatus(200);
      }
    });
  });

  return router;
}
