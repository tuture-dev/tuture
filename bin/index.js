#!/usr/bin/env node

const cp = require('child_process');

const tuturePath = process.cwd();

process.chdir(__dirname);
cp.execSync(`TUTURE_PATH=${tuturePath} npm start`);
process.chdir(tuturePath);
