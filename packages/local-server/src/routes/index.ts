import { Router } from 'express';

import diffRouter from './diff.js';
import metaRouter from './meta.js';
import tocRouter from './toc.js';
import articlesRouter from './articles.js';
import { createUploadRouter } from './upload.js';

export function createApiRouter() {
  const router = Router();

  router.use('/diff', diffRouter);
  router.use('/meta', metaRouter);
  router.use('/toc', tocRouter);
  router.use('/articles', articlesRouter);
  router.use('/upload', createUploadRouter());

  return router;
}
