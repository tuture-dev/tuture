const { makeServer } = require('@tuture/local-server');
const mockRemotes = require('./fixtures/mock-remotes.json');

const PORT = 8000;

const app = makeServer({
  baseUrl: '/api',
  mockRoutes: (app) => {
    app.get('/api/remotes', (req, res) => {
      res.json(mockRemotes);
    });

    app.get('/api/sync', (req, res) => {
      setTimeout(() => {
        res.sendStatus(200);
      }, 2000);
    });
  },
});

app.listen(PORT, () => {
  console.log(`API server is running on http://localhost:${PORT}!`);
});
