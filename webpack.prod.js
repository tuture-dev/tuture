const fs = require('fs');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter((x) => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => {
    nodeModules[mod] = 'commonjs ' + mod;
  });

const base = {
  mode: 'production',
  bail: true,
  context: __dirname,
  devtool: false,
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[ext]',
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: path.resolve(__dirname, 'src'),
      },
    ],
  },
  plugins: [new CleanWebpackPlugin(['dist'])],
};

const serverConfig = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  entry: './src/server/index.tsx',
  output: {
    filename: 'server.js',
    pathinfo: false,
  },
  externals: nodeModules,
};

const clientConfig = {
  entry: './src/index.tsx',
  output: {
    filename: 'static/js/bundle.js',
    pathinfo: false,
  },
};

module.exports = [
  Object.assign(serverConfig, base),
  Object.assign(clientConfig, base),
];
