const { makeServer } = require('@tuture/local-server');
const mockRemotes = require('./fixtures/mock-remotes.json');
const mockDiff = require('./fixtures/mock-diff.json');

const PORT = 8000;

const app = makeServer({
  baseUrl: '/api',

  // 以下路由会覆盖原始的路由，便于测试
  mockRoutes: (app) => {
    app.get('/api/remotes', (req, res) => {
      res.json(mockRemotes);
    });

    app.get('/api/sync', (req, res) => {
      setTimeout(() => {
        res.sendStatus(200);
      }, 2000);
    });

    app.get('/api/diff', (req, res) => {
      const { commit, file } = req.query;
      if (!commit || !file) {
        res.status(400).json(req.query);
      }
      res.json(mockDiff[commit][file]);
    });
  },
});

app.listen(PORT, () => {
  console.log(`API server is running on http://localhost:${PORT}!`);
});
