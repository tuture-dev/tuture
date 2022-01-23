import { Router } from 'express';
import cp from 'child_process';

import diffRouter from './diff.js';
import metaRouter from './meta.js';
import tocRouter from './toc.js';
import articlesRouter from './articles.js';
import uploadRouter from './upload.js';

const router = Router();

router.use('/diff', diffRouter);
router.use('/meta', metaRouter);
router.use('/toc', tocRouter);
router.use('/articles', articlesRouter);
router.use('/upload', uploadRouter);

router.get('/sync', async (req, res) => {
  cp.execFile('tuture', ['sync'], {}, (err) => {
    if (err) {
      res.status(500).json({ code: err.code, message: err.message });
    } else {
      res.sendStatus(200);
    }
  });
});

export default router;
