const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const openBrowser = require('./openBrowser');
const config = require('../webpack.config');

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const options = {
  contentBase: './dist',
  host: 'localhost',
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(3000, 'localhost', () => {
  console.log('Happy Writing!');
  openBrowser('http://localhost:3000/');
});
