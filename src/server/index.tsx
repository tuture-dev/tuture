import fs from 'fs';
import http from 'http';
import path from 'path';

import express from 'express';
import logger from 'morgan';
import React from 'react';
import { renderToString } from 'react-dom/server';
import opn from 'opn';
import socketio from 'socket.io';
import yaml from 'js-yaml';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

import App from '../components/App';
import html from './html';
import { Tuture } from '../types/';

const port = 3000;
const app = express();
const server = http.createServer(app);

const tuturePath = process.env.TUTURE_PATH;
const tutureYAMLPath = path.join(tuturePath, 'tuture.yml');
const diffPath = path.join(tuturePath, '.tuture', 'diff.json');

const io = socketio(server);
let reloadCounter = 0;

io.on('connection', (socket) => {
  reloadCounter += 1;
  console.log('browser connected!');

  // Server has just been restarted.
  if (reloadCounter === 1) {
    socket.emit('reload');
  }

  socket.on('disconnect', () => {
    console.log('browser disconnected!');
  });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('dist'));
app.use(express.static('dist'));

app.get('/', (req, res) => {
  const tutureYAML = fs.readFileSync(tutureYAMLPath, {
    encoding: 'utf8',
  });
  const tuture = yaml.safeLoad(tutureYAML) as Tuture;
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

app.get('/reload', (req, res) => {
  io.emit('reload');
  res.status(200);
  res.end();
});

server.listen(port, () => {
  if (!process.env.WATCHING) {
    console.log(`Tutorial is served on http://localhost:${port}`);
    opn('http://localhost:3000');
  }
});
