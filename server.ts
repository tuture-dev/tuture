import fs from 'fs';
import http from 'http';
import path from 'path';
import yaml from 'js-yaml';
import logger from 'morgan';
import multer from 'multer';
import express from 'express';
import socketio from 'socket.io';

import { TUTURE_ROOT } from './config';

const app = express();
const server = http.createServer(app);

const workspace = process.env.TUTURE_PATH || process.cwd();
const tutureYMLPath = path.join(workspace, 'tuture.yml');
const diffPath = path.join(workspace, TUTURE_ROOT, 'diff.json');
const assetsPath = path.join(workspace, 'tuture-assets');

const upload = multer({ dest: assetsPath });

const io = socketio(server);

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static(path.join(__dirname, './editor/static')));
app.use('/tuture-assets', express.static(assetsPath));

app.get('/', (_, res) => {
  const html = fs
    .readFileSync(path.join(__dirname, './editor/index.html'))
    .toString();
  res.send(html);
});

app.get('/diff', (_, res) => {
  res.json(JSON.parse(fs.readFileSync(diffPath).toString()));
});

app.get('/tuture', (_, res) => {
  res.json(yaml.safeLoad(fs.readFileSync(tutureYMLPath).toString()));
});

app.post('/save', (req, res) => {
  const body = req.body;
  try {
    const tuture = yaml.safeDump(body);
    fs.writeFileSync(tutureYMLPath, tuture);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  const savePath = path.join('tuture-assets', req.file.filename);
  res.json({ path: savePath });
});

app.get('/reload', (_, res) => {
  io.emit('reload');
  res.sendStatus(200);
});

export default server;
