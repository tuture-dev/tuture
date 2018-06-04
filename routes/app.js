const fs = require('fs');

const yaml = require('js-yaml');
const ejs = require('ejs');
const parseDiff = require('../utils/parseDiff');

module.exports = (ymlPath) => {
  const tutureYml = fs.readFileSync(`${ymlPath}/tuture.yml`, {
    encoding: 'utf8',
  });
  const tuture = yaml.safeLoad(tutureYml);
  
  let selectedCatalogItem = 0;

  const { commit } = tuture.steps[selectedCatalogItem];
  const diffText = fs.readFileSync(`${ymlPath}/.tuture/diff/${commit}.diff`, {
    encoding: 'utf8',
  });
  const files = parseDiff(diffText);
  
  const appRouter = (req, res) => {
    res.render('app', { 
      tuture: tuture, 
      selectedCatalogItem: selectedCatalogItem,
      files: files,
      viewType: 'split',
    });
  };

  return appRouter;
}