import crypto from 'crypto';
import fs from 'fs-extra';
import http from 'http';
import path from 'path';
import logger from 'morgan';
import multer from 'multer';
import express, { Request, Response, NextFunction } from 'express';
import socketio from 'socket.io';

import { DIFF_PATH, EDITOR_STATIC_PATH, EDITOR_PATH } from './constants';
import { uploadSingle } from './utils/assets';
import { loadCollection, saveTuture } from './utils/tuture';

const workspace = process.env.TUTURE_PATH || process.cwd();
const diffPath = path.join(workspace, DIFF_PATH);

const makeServer = (config: any) => {
  const app = express();
  const server = http.createServer(app);
  const { assetsRoot } = config;

  // Socket.IO server instance.
  const io = socketio(server);

  // File upload middleware.
  const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, assetsRoot);
      },
    }),
  });

  // Middleware for checking whether assets root exists.
  const checkAssetsRoot = (req: Request, res: Response, next: NextFunction) => {
    if (!fs.existsSync(assetsRoot)) {
      fs.mkdirSync(assetsRoot);
    }
    next();
  };

  if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
  }

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use('/static', express.static(EDITOR_STATIC_PATH));
  app.use(`/${assetsRoot}`, express.static(assetsRoot));

  app.get('/', (_, res) => {
    const html = fs
      .readFileSync(path.join(EDITOR_PATH, 'index.html'))
      .toString();
    res.send(html);
  });

  app.get('/diff', (_, res) => {
    res.json(JSON.parse(fs.readFileSync(diffPath).toString()));
  });

  app.get('/collection', async (_, res) => {
    const collection = await loadCollection();
    res.json(collection);
  });

  app.post('/save', (req, res) => {
    const body = req.body;
    body.updated = new Date();
    saveTuture(body);
    res.sendStatus(200);
  });

  app.post('/upload', checkAssetsRoot, upload.single('file'), (req, res) => {
    const { originalname } = req.file;
    let savePath = path.join(assetsRoot, originalname);

    // If target file already exists (likely to happen when uploading image
    // from clipboard), append a unique ID to its name.
    if (fs.existsSync(savePath)) {
      const { dir, name, ext } = path.parse(savePath);
      const uniqueId = crypto.randomBytes(8).toString('hex');
      savePath = path.join(dir, `${name}-${uniqueId}${ext}`);
    }

    // Move temporarily created file to final save path.
    fs.moveSync(req.file.path, savePath);

    // Enforce UNIX style path sep in markdown asset path.
    savePath = savePath.split(path.sep).join('/');

    // Trying to upload to image hosting.
    uploadSingle(savePath);

    res.json({ path: savePath });
  });

  app.get('/reload', (_, res) => {
    io.emit('reload');
    res.sendStatus(200);
  });

  return app;
};

export default makeServer;
