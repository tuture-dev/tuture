import fs from 'fs-extra';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from 'morgan';
import express, { Express } from 'express';

import { createBaseRouter } from './routes';
import TaskQueue from './utils/task-queue.js';
import { configureRealtimeCollab } from './utils/realtime.js';

// Editor path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EDITOR_PATH = path.join(__dirname, 'editor');
const EDITOR_STATIC_PATH = path.join(EDITOR_PATH, 'static');

export interface ServerOptions {
  baseUrl?: string;
  mockRoutes?: (app: Express) => void;
  onGitHistoryChange?: (curr: fs.Stats, prev: fs.Stats) => void;
}

export function makeServer(options?: ServerOptions): http.Server {
  const app = express();
  const queue = new TaskQueue();
  const apiRouter = createBaseRouter(queue);

  // Make sure the task queue is flushed
  process.on('exit', () => queue.flush());

  const { mockRoutes, baseUrl = '/api', onGitHistoryChange } = options || {};

  // Watch for changes of git master ref if listener is provided.
  if (onGitHistoryChange) {
    fs.watchFile(
      '.git/refs/heads/master',
      { interval: 1000 },
      onGitHistoryChange,
    );
  }

  if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
  }

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use('/static', express.static(EDITOR_STATIC_PATH));
  // app.use('/assets', express.static(assetsRoot));

  // Register mocking routes. This will override real routes below.
  // (For development purposes only.)
  if (mockRoutes) {
    mockRoutes(app);
  }

  app.use(baseUrl, apiRouter);

  const editorHTMLPath = path.join(EDITOR_PATH, 'index.html');
  const editorHTML = fs.existsSync(editorHTMLPath)
    ? fs.readFileSync(editorHTMLPath).toString()
    : '';
  app.get('*', (_, res) => {
    if (editorHTML) {
      return res.send(editorHTML);
    }
    res.sendStatus(404);
  });

  const server = http.createServer(app);
  configureRealtimeCollab(server);

  return server;
}
