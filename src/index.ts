import fs from 'fs';
import http from 'http';
import path from 'path';

import express from 'express';
import logger from 'morgan';
import multer from 'multer';
import favicon from 'serve-favicon';
import opn from 'opn';
import socketio from 'socket.io';
import yaml from 'js-yaml';

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

app.get('/', (_, res) => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html')).toString();
  res.send(html);
});

app.get('/diff', (_, res) => {
  res.json(JSON.parse(fs.readFileSync(diffPath).toString()));
});

app.get('/tuture', (_, res) => {
  res.json(yaml.safeLoad(fs.readFileSync(tutureYAMLPath).toString()));
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

app.get('/reload', (_, res) => {
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
