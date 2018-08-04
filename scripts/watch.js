#!/usr/bin/env node

const fs = require('fs');
const nodemon = require('nodemon');
const path = require('path');
const openBrowser = require('./openBrowser');

process.env.WATCHING = true;

// Add dummy server.js to avoid annoy 'Cannot find module ...'
// error before webpack inital build is completed.
const dummyServerJS = `
console.log('');
console.log('Please wait for webpack initial build…');
console.log('It might take a few seconds…');
`;

fs.mkdirSync('dist');
fs.mkdirSync(path.join('dist', 'js'));
fs.writeFileSync(path.join('dist', 'js', 'server.js'), dummyServerJS);

let restartCounter = 0;

nodemon({ script: 'bin/tuture-server' }).on('restart', () => {
  console.log(`nodemon restart(${restartCounter})`);
  restartCounter++;
  if (restartCounter === 1) {
    setTimeout(() => {
      openBrowser('http://localhost:3000');
    }, 500);
  }
});

process.on('SIGINT', () => {
  process.exit(0);
});
