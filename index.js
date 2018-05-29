#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const cp = require('child_process');

// TODO: Turn to server to avoid all this inconveniences.
fs.writeFileSync(
  path.join(__dirname, 'src', 'path.json'),
  `{\n "path": "${process.cwd()}" \n}`,
);

process.chdir(__dirname);
cp.execSync('npm start');
