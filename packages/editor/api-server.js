const { makeServer } = require('@tuture/local-server');

const PORT = 8000;

const app = makeServer({
  mockRoutes: (app) => {
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

    app.get('/sync', (req, res) => {
      setTimeout(() => {
        res.sendStatus(500);
      }, 2000);
    });
  },
});

app.listen(PORT, () => {
  console.log(`API server is running on http://localhost:${PORT}!`);
});
