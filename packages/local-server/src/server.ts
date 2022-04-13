import fs from 'fs-extra';
import debug from 'debug';
import http from 'http';
import path from 'path';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import express, { Express } from 'express';

import { createApiRouter } from './routes/index.js';
import { configureRealtimeCollab } from './utils/realtime.js';

const d = debug('tuture:local-server:server');

// Editor path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EDITOR_PATH = path.join(__dirname, 'editor');

export interface ServerOptions {
  baseUrl?: string;
  mockRoutes?: (app: Express) => void;
  onGitHistoryChange?: (curr: fs.Stats, prev: fs.Stats) => void;
}

export function makeServer(options?: ServerOptions): http.Server {
  const app = express();

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
  // app.use('/assets', express.static(assetsRoot));

  // Register mocking routes. This will override real routes below.
  // (For development purposes only.)
  if (mockRoutes) {
    mockRoutes(app);
  }

  d('baseUrl: %s', baseUrl);
  app.use(baseUrl, createApiRouter());

  d('editor path: %s', EDITOR_PATH);
  app.use('/', express.static(EDITOR_PATH));

  app.get('*', (_, res) => {
    res.send('404 Not Found');
  });

  const server = http.createServer(app);
  configureRealtimeCollab(server);

  return server;
}
