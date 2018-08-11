import fs from 'fs';
import http from 'http';
import path from 'path';

import express from 'express';
import logger from 'morgan';
import multer from 'multer';
import React from 'react';
import { renderToString } from 'react-dom/server';
import opn from 'opn';
import socketio from 'socket.io';
import yaml from 'js-yaml';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

import App from '../components/App';
import html from './html';
import { Tuture } from '../types/';

const port = process.env.TUTURE_PORT || 3000;
const app = express();
const server = http.createServer(app);

const inDevMode = process.env.NODE_ENV === 'development';

const tuturePath = process.env.TUTURE_PATH || process.cwd();
const tutureYAMLPath = path.join(tuturePath, 'tuture.yml');
const diffPath = path.join(tuturePath, '.tuture', 'diff.json');
const assetsPath = path.join(tuturePath, 'tuture-assets');

const upload = multer({ dest: assetsPath });

const io = socketio(server);
let reloadCounter = 0;

io.on('connection', (socket) => {
  reloadCounter += 1;

  // Server has just been restarted.
  if (reloadCounter === 1 && inDevMode) {
    socket.emit('reload');
  }
});

if (inDevMode) {
  app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/tuture-assets', express.static(assetsPath));

app.get('/', (req, res) => {
  const tutureYAML = fs.readFileSync(tutureYAMLPath, {
    encoding: 'utf8',
  });
  const tuture = yaml.safeLoad(tutureYAML) as Tuture;
  const title = tuture.name;
  const diff = fs.readFileSync(diffPath, {
    encoding: 'utf8',
  });

  // add SSR style
  const sheet = new ServerStyleSheet();
  const body = renderToString(
    <StyleSheetManager sheet={sheet.instance}>
      <App diff={diff} tuture={JSON.stringify(tuture)} />
    </StyleSheetManager>,
  );
  const styleTags = sheet.getStyleTags();

  res.send(
    html({
      body,
      title,
      diff,
      css: styleTags,
      tuture: JSON.stringify(tuture),
    }),
  );
});

app.post('/save', (req, res) => {
  const body = req.body;
  try {
    const tuture = yaml.safeDump(body);
    fs.writeFileSync(tutureYAMLPath, tuture);
    res.status(200);
    res.end();
  } catch (err) {
    res.status(500);
    res.send({ msg: err.message });
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  const savePath = path.join('tuture-assets', req.file.filename);
  res.json({ path: savePath });
  res.end();
});

app.get('/reload', (req, res) => {
  io.emit('reload');
  res.status(200);
  res.end();
});

server.listen(port, () => {
  if (!inDevMode) {
    const url = `http://localhost:${port}`;
    console.log(`Tutorial is served on ${url}`);
    opn(url);
  }
});
