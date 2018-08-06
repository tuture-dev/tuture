#!/usr/bin/env node

const nodemon = require('nodemon');
const openBrowser = require('./openBrowser');

const URL = 'http://localhost:3000';

process.env.WATCHING = true;

let restartCounter = 0;

nodemon({ script: 'bin/tuture-server' }).on('restart', () => {
  restartCounter++;
  // Open browser when it's reloaded for the first time.
  if (restartCounter === 1) {
    setTimeout(() => {
      openBrowser(URL);
    }, 500);
  }
});

process.on('SIGINT', () => {
  process.exit(0);
});
