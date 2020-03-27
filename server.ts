import crypto from 'crypto';
import cp from 'child_process';
import fs from 'fs-extra';
import http from 'http';
import path from 'path';
import logger from 'morgan';
import multer from 'multer';
import express, { Request, Response, NextFunction } from 'express';
import socketio from 'socket.io';

import { DIFF_PATH, EDITOR_STATIC_PATH, EDITOR_PATH } from './constants';
import { uploadSingle } from './utils/assets';
import { loadCollection, saveCollection } from './utils/collection';
import { git } from './utils/git';

const workspace = process.env.TUTURE_PATH || process.cwd();
const diffPath = path.join(workspace, DIFF_PATH);
const assetsRoot = '.tuture/assets';

const makeServer = (config: any) => {
  const app = express();
  const server = http.createServer(app);

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
  app.use(`/.tuture/assets`, express.static(assetsRoot));

  app.get('/diff', (_, res) => {
    res.json(JSON.parse(fs.readFileSync(diffPath).toString()));
  });

  app.get('/collection', (_, res) => {
    res.json(loadCollection());
  });

  app.get('/remotes', (_, res) => {
    git
      .getRemotes(true)
      .then((remotes) => res.json(remotes))
      .catch((err) => res.status(500).json(err));
  });

  app.post('/save', (req, res) => {
    saveCollection(req.body);
    res.sendStatus(200);
  });

  app.get('/sync', async (req, res) => {
    cp.execFile('tuture', ['sync'], {}, (err) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  });

  app.post('/upload', checkAssetsRoot, upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).send({ message: '未指定图片！' });
    }

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

  app.get('*', (_, res) => {
    const html = fs
      .readFileSync(path.join(EDITOR_PATH, 'index.html'))
      .toString();
    res.send(html);
  });

  return app;
};

export default makeServer;
