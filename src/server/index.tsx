import fs from 'fs';
import path from 'path';

import express from 'express';
import logger from 'morgan';
import React from 'react';
import { renderToString } from 'react-dom/server';
import opn from 'opn';
import yaml from 'js-yaml';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

import App from '../components/App';
import html from './html';
import { Tuture } from '../types/';

const port = 3000;
const server = express();
const tuturePath = process.env.TUTURE_PATH;

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static('dist'));

const tutureYAMLPath = path.join(tuturePath, 'tuture.yml');
const diffPath = path.join(tuturePath, '.tuture', 'diff.json');

server.get('/', (req, res) => {
  const tutureYAML = fs.readFileSync(tutureYAMLPath, {
    encoding: 'utf8',
  });
  const tuture = yaml.safeLoad(tutureYAML) as Tuture;
  console.log(tuture.steps[0]);
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

server.post('/save', (req, res) => {
  const body = req.body;
  try {
    console.log(body);
    const tuture = yaml.safeDump(body);
    fs.writeFileSync(tutureYAMLPath, tuture);
    res.status(200);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send({ msg: err.message });
  }
});

server.listen(port, () => {
  console.log(`Tutorial is served on http://localhost:${port}`);

  if (!process.env.WATCHING) {
    opn('http://localhost:3000');
  }
});
