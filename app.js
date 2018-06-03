const appRouter = require('./routes/app');

module.exports = (ymlPath) => {
  const express = require('express');
  const app = express();

  const PORT = 3000;

  // a series of config for view engine
  app.set('views', './views');
  app.set('view engine', 'ejs', {
    cache: false,
  });

  // a series of config for static files
  app.use(express.static('testPublic'));

  app.get('/', appRouter(ymlPath));

  app.listen(PORT, () => {
    console.log(`Now server listening on port ${PORT}...`);
  });
};
