import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import { TUTURE_ROOT, DIFF_PATH } from '@tuture/core';

const workspace = process.env.TUTURE_PATH || process.cwd();
const diffPath = path.join(workspace, TUTURE_ROOT, DIFF_PATH);

export const createDiffRouter = () => {
  const router = Router();

  router.get('/', (_, res) => {
    res.json(JSON.parse(fs.readFileSync(diffPath).toString()));
  });

  return router;
};
