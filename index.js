#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const cp = require('child_process');

const program = require('commander');

const VERSION = require('./package.json').version;

program
  .version(VERSION)
  .description('Tuture-render assit tuture, to make it intact')
  .parse(process.argv);

const rendererPath = cp.execSync('pwd', { encoding: 'utf-8' });

const dirname = __dirname;

const execulatePath = process.cwd();
fs.writeFileSync(dirname + '/src/path.json', `{\n "path": "${execulatePath}" \n}`);

process.chdir(dirname);
cp.execSync('npm start');

