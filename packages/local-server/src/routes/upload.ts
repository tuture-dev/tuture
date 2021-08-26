import fs from 'fs-extra';
import path from 'path';
import { Router } from 'express';
import multer from 'multer';
import { randHex } from '@tuture/core';

import { assetsRoot } from '../utils/assets';

fs.ensureDirSync(assetsRoot);

const diskStorage = multer.diskStorage({
  destination: assetsRoot,
  filename: function(req, file, cb) {
    let fname = file.originalname;
    const { name, ext } = path.parse(fname);

    // make sure to choose a unique filename
    while (fs.existsSync(path.join(assetsRoot, fname))) {
      fname = `${name}-${randHex(7)}${ext}`;
    }

    cb(null, fname);
  },
});
const upload = multer({ storage: diskStorage });

export const createUploadRouter = () => {
  const router = Router();

  router.post('/', upload.array('files'), (req, res) => {
    const files = (req.files as Express.Multer.File[]) || [];
    console.log('files', files);
    const targets = files.map((file) => `/assets/${file.filename}`);
    console.log('targets', targets);
    res.json(targets);
  });

  return router;
};
