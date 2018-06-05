const fs = require('fs');

const yaml = require('js-yaml');
const ejs = require('ejs');
const parseDiff = require('../utils/parseDiff');

module.exports = (ymlPath, selectedCatalogItem) => {
  const tutureYml = fs.readFileSync(`${ymlPath}/tuture.yml`, {
    encoding: 'utf8',
  });
  const tuture = yaml.safeLoad(tutureYml);
  
  const appRouter = (req, res) => {
    const { commit } = tuture.steps[selectedCatalogItem];
    const diffText = fs.readFileSync(`${ymlPath}/.tuture/diff/${commit}.diff`, {
      encoding: 'utf8',
    });
    const files = parseDiff(diffText);

    res.render('app', { 
      tuture: tuture, 
      selectedCatalogItem: selectedCatalogItem,
      files: files,
      viewType: 'split',
    });
  };

  return appRouter;
}