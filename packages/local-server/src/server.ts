import cp from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import logger from 'morgan';
import express, { Express } from 'express';

import {
  createArticlesRouter,
  createCollectionStepsRouter,
  createDiffRouter,
  createFragmentRouter,
  createMetaRouter,
  createRemotesRouter,
  createTocRouter,
} from './routes';
import TaskQueue from './utils/task-queue';

// Editor path
const EDITOR_PATH = path.join(__dirname, 'editor');
const EDITOR_STATIC_PATH = path.join(EDITOR_PATH, 'static');

export interface ServerOptions {
  mockRoutes?: (app: Express) => void;
}

export const makeServer = (options?: ServerOptions) => {
  const app = express();
  const queue = new TaskQueue();

  // Make sure the task queue is flushed
  process.on('exit', () => queue.flush());

  const { mockRoutes } = options || {};

  if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
  }

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use('/static', express.static(EDITOR_STATIC_PATH));

  // Register mocking routes. This will override real routes below.
  // (For development purposes only.)
  if (mockRoutes) {
    mockRoutes(app);
  }

  app.use('/api/articles', createArticlesRouter(queue));
  app.use('/api/collection-steps', createCollectionStepsRouter(queue));
  app.use('/api/diff', createDiffRouter());
  app.use('/api/fragment', createFragmentRouter(queue));
  app.use('/api/meta', createMetaRouter(queue));
  app.use('/api/remotes', createRemotesRouter(queue));
  app.use('/api/toc', createTocRouter(queue));

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
