const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const morgan = require('morgan');

const app = express();
const mockRoot = path.join('src', 'utils', 'data');
const collectionPath = path.join(mockRoot, 'converted-tuture.json');
const diffPath = path.join(mockRoot, 'diff.json');

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
  const body = req.body;
  body.updated = new Date();
  fs.writeFileSync(collectionPath, JSON.stringify(body, null, 2));
  res.sendStatus(200);
});

app.post('/upload', (req, res) => {
  res.json({ path: 'https://tuture.co/images/covers/abfd872.jpg' });
});

app.listen(8000, () => {
  console.log('API server is running!');
});
