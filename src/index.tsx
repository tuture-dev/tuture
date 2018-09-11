import fs from 'fs';
import http from 'http';
import path from 'path';

import express from 'express';
import handlebars from 'handlebars';
import logger from 'morgan';
import multer from 'multer';
import React from 'react';
import { renderToString } from 'react-dom/server';
import favicon from 'serve-favicon';
import opn from 'opn';
import socketio from 'socket.io';
import yaml from 'js-yaml';
import { Provider } from 'mobx-react';
import { I18nextProvider } from 'react-i18next';
import i18nMiddleware from 'i18next-express-middleware';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

import Store from './ui/store';
import App from './ui/components/App';
import i18n from './i18n.server';

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

app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/tuture-assets', express.static(assetsPath));
app.use(i18nMiddleware.handle(i18n));

app.get('/', (req: any, res) => {
  const tutureYAML = fs.readFileSync(tutureYAMLPath, {
    encoding: 'utf8',
  });
  const tuture = yaml.safeLoad(tutureYAML) as Tuture;
  const title = tuture.name;
  const diff = fs.readFileSync(diffPath, {
    encoding: 'utf8',
  });

  const store = new Store();
  const locale = 'en';
  const resources = i18n.getResourceBundle(locale, 'translations');
  const i18nClient = { locale, resources };
  const i18nServer = i18n.cloneInstance();
  i18nServer.changeLanguage(locale);

  // add SSR style
  const sheet = new ServerStyleSheet();
  const body = renderToString(
    <StyleSheetManager sheet={sheet.instance}>
      <I18nextProvider i18n={i18nServer}>
        <Provider store={store}>
          <App diff={diff} tuture={JSON.stringify(tuture)} />
        </Provider>
      </I18nextProvider>
    </StyleSheetManager>,
  );
  const styleTags = sheet.getStyleTags();

  const html = fs.readFileSync(path.join(__dirname, 'index.html')).toString();
  const template = handlebars.compile(html, { noEscape: true });

  // Here we don't turn to full-fledged HTML escaping, since it will
  // mess up JSON data and make unescaping unapproachable.
  const escape = (s: string) =>
    s
      ? s
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
      : '';

  res.send(
    template({
      body,
      title,
      diff: escape(diff),
      css: styleTags,
      i18n: JSON.stringify(i18nClient),
      tuture: escape(JSON.stringify(tuture)),
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
