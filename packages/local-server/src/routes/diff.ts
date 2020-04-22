import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import { TUTURE_ROOT, DIFF_PATH, DiffFile } from '@tuture/core';

const workspace = process.env.TUTURE_PATH || process.cwd();
const diffPath = path.join(workspace, TUTURE_ROOT, DIFF_PATH);

export const createDiffRouter = () => {
  const router = Router();
  let diff: DiffFile[] | null;

  router.get('/', (_, res) => {
    if (!diff) {
      diff = JSON.parse(fs.readFileSync(diffPath).toString());
    }

    res.json(diff);
  });

  return router;
};
