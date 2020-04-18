import cp from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import logger from 'morgan';
import express from 'express';
import simplegit from 'simple-git/promise';
import { DIFF_PATH, TUTURE_ROOT } from '@tuture/core';

import { loadCollection, saveCollection } from './collection';

// Editor path
const EDITOR_PATH = path.join(__dirname, 'editor');
const EDITOR_STATIC_PATH = path.join(EDITOR_PATH, 'static');

const workspace = process.env.TUTURE_PATH || process.cwd();
const diffPath = path.join(workspace, TUTURE_ROOT, DIFF_PATH);

export const makeServer = () => {
  const app = express();
  const git = simplegit().silent(true);

  if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
  }

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use('/static', express.static(EDITOR_STATIC_PATH));

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
        res.status(500).json({ exitCode: err.code });
      } else {
        res.sendStatus(200);
      }
    });
  });

  app.get('*', (_, res) => {
    const html = fs
      .readFileSync(path.join(EDITOR_PATH, 'index.html'))
      .toString();
    res.send(html);
  });

  return app;
};
