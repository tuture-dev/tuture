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

  let selectedCatalogItem = 0;

  // a series of config for static files
  app.use(express.static('testPublic'));

  app.get('/', (req, res) => {
    return appRouter(ymlPath, selectedCatalogItem)(req, res);
  });

  // this api is for change changeSelectedCatalogItem
  app.get('/changeSelectedCatalogItem/:id', (req, res) => {
    const newSelectedItem = req.params.id;
    selectedCatalogItem = newSelectedItem;
    return appRouter(ymlPath, selectedCatalogItem)(req, res);
  });

  app.listen(PORT, () => {
    console.log(`Now server listening on port ${PORT}...`);
  });
};
