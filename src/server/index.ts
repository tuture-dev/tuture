import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import opn from 'opn';
import yaml from 'js-yaml';

import fs from 'fs';

import App from '../components/App';
import html from './html';
import { Tuture } from '../types/';

const port = 3000;
const server = express();
const tuturePath = process.env.TUTURE_PATH;

server.use(express.static('dist'));

server.get('/', (req, res) => {
  const tutureYAML = fs.readFileSync(`${tuturePath}/tuture.yml`, {
    encoding: 'utf8',
  });
  const tuture = yaml.safeLoad(tutureYAML) as Tuture;
  const diff = fs.readFileSync(`${tuturePath}/.tuture/diff.json`, {
    encoding: 'utf8',
  });
  const body = renderToString(
    React.createElement(App, { diff, tuture: JSON.stringify(tuture) }),
  );

  res.send(
    html({
      body,
      diff,
      tuture: JSON.stringify(tuture),
    }),
  );
});

server.listen(port, () => {
  console.log(`App is listening on port ${port}`);
  opn('http://localhost:3000');
});
