const fs = require('fs');
const path = require('path');
const cp = require('child_process');

// inspect whether execulatePath is exists
const ymlPath = process.cwd();
if (fs.existsSync(ymlPath)) {
  // change the execulate path to this project path
  process.chdir(__dirname);

  // import app.js execulate logic
  require('./app')(ymlPath);
} else {
  process.exit(1);
}
