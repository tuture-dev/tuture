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
const devServer = new webpackDevServer(compiler, options);

devServer.listen(3000, 'localhost', () => {
  console.log('Happy Writing!');
  openBrowser('http://localhost:3000/');
});

['SIGINT', 'SIGTERM'].forEach(function(sig) {
  process.on(sig, function() {
    devServer.close();
    process.exit();
  });
});
