import fs from 'fs';
import path from 'path';

import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import opn from 'opn';
import yaml from 'js-yaml';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import cors from 'cors';
import { matchPath, StaticRouter } from 'react-router-dom';

import App from '../components/App';
import html from './html';
import { Tuture, TutureMeta, DiffItem } from '../types/';
import { extractCommits, extractMetaData } from '../utils/extractors';
import routes from '../shared/routes';

const port = 3000;
const server = express();
const tuturePath = process.env.TUTURE_PATH;

server.use(cors());
server.use(express.static('dist'));

const tutureYAMLPath = path.join(tuturePath, 'tuture.yml');
const tutureYAML = fs.readFileSync(tutureYAMLPath, {
  encoding: 'utf8',
});
const tuture = yaml.safeLoad(tutureYAML) as Tuture;
const diffPath = path.join(tuturePath, '.tuture', 'diff.json');
let diff = fs.readFileSync(diffPath, {
  encoding: 'utf8',
});
diff = JSON.parse(diff);

const commits = extractCommits(tuture);
const introduction = extractMetaData(tuture);

function ssr(appContent: React.ReactNode, location: string, context: any) {
  const sheet = new ServerStyleSheet();
  const needRenderContent = (
    <StyleSheetManager sheet={sheet.instance}>
      <StaticRouter location={location} context={context}>
        {appContent}
      </StaticRouter>
    </StyleSheetManager>
  );
  const body = renderToString(needRenderContent);
  const styleTags = sheet.getStyleTags();

  return { body, styleTags };
}

server.get('/*', (req, res, next) => {
  const context = {};
  let nowSelect = 0;
  const commit = commits.find(
    (commit) => req.url.indexOf(commit.commit) !== -1,
  );

  if (commit) {
    const content = tuture.steps.find((step, index) => {
      if (step.commit === commit.commit) {
        nowSelect = index;
        return true;
      }
    });
    const diffItem = diff[nowSelect];

    const appContent = (
      <App
        introduction={JSON.stringify(introduction)}
        commits={JSON.stringify(commits)}
        content={JSON.stringify(content)}
        diffItem={JSON.stringify(diffItem)}
      />
    );

    const { body, styleTags } = ssr(appContent, req.url, context);

    return res.send(
      html({
        body,
        content: JSON.stringify(content),
        diffItem: JSON.stringify(diff[nowSelect]),
        introduction: JSON.stringify(introduction),
        commits: JSON.stringify(commits),
        css: styleTags,
      }),
    );
  }

  const appContent = (
    <App
      introduction={JSON.stringify(introduction)}
      commits={JSON.stringify(commits)}
    />
  );

  const { body, styleTags } = ssr(appContent, req.url, context);

  return res.send(
    html({
      body,
      introduction: JSON.stringify(introduction),
      commits: JSON.stringify(commits),
      css: styleTags,
    }),
  );
});

server.listen(port, () => {
  console.log(`Tutorial is served on http://localhost:${port}`);

  if (!process.env.WATCHING) {
    opn('http://localhost:3000');
  }
});
