const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const tmp = require('tmp');

const app = express();
const mockRoot = path.join('src', 'utils', 'data');
const collectionPath = path.join(mockRoot, 'collection.json');
const diffPath = path.join(mockRoot, 'diff.json');

const tmpDir = tmp.dirSync();
const upload = multer({ dest: tmpDir.name });

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

app.get('/diff', (_, res) => {
  res.json(JSON.parse(fs.readFileSync(diffPath)));
});

app.get('/collection', async (_, res) => {
  res.json(JSON.parse(fs.readFileSync(collectionPath)));
});

app.post('/save', (req, res) => {
  fs.writeFileSync(collectionPath, JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.post('/upload', upload.single('file'), (req, res) => {
  console.log('detect upload', req.file);
  res.json({ path: 'https://tuture.co/images/covers/abfd872.jpg' });
});

app.post('/commit', (req, res) => {
  setTimeout(() => {
    res.sendStatus(200);
  }, 1000);
});

app.listen(8000, () => {
  console.log('API server is running!');
});

process.on('exit', () => {
  console.log('Removing temporary directory ...');
  tmpDir.removeCallback();
});
