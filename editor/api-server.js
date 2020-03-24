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

app.get('/remotes', (_, res) => {
  res.json([
    {
      name: 'origin',
      refs: {
        fetch: 'https://github.com/tuture-dev/tuture.git',
        push: 'https://github.com/tuture-dev/tuture.git',
      },
    },
    {
      name: 'gitlab',
      refs: {
        fetch: 'https://gitlab.com/tuture-dev/tuture.git',
        push: 'https://gitlab.com/tuture-dev/tuture.git',
      },
    },
    {
      name: 'coding',
      refs: {
        fetch: 'https://e.coding.net/tuture-dev/tuture.git',
        push: 'https://e.coding.net/tuture-dev/tuture.git',
      },
    },
  ]);
});

app.post('/save', (req, res) => {
  fs.writeFileSync(collectionPath, JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.get('/sync', (req, res) => {
  setTimeout(() => {
    res.sendStatus(200);
  }, 5000);
});

app.post('/upload', upload.single('file'), (req, res) => {
  console.log('detect upload', req.file);
  res.json({ path: 'https://source.unsplash.com/random/400x200' });
});

app.listen(8000, () => {
  console.log('API server is running!');
});

process.on('exit', () => {
  console.log('Removing temporary directory ...');
  tmpDir.removeCallback();
});
