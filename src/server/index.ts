import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import yaml from 'js-yaml';

import fs from 'fs';

import App from '../components/App';
import html from './html';
import { Tuture, DiffItem } from '../types/';

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

  // 这里是渲染成 HTML，会动态插入 data-react-id 等属性，便于 client 端的 react 使用
  const body = renderToString(
    React.createElement(App, { name: 'Test Header' }),
  );

  res.send(
    html({
      body,
      initialProps: { tuture, diff },
    }),
  );
});

server.listen(port, () => console.log(`App is listening on port ${port}`));
