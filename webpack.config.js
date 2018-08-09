const fs = require('fs');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter((x) => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => {
    nodeModules[mod] = 'commonjs ' + mod;
  });

const base = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  plugins: [new CleanWebpackPlugin(['dist'])],
};

if (process.env.NODE_ENV === 'development') {
  base.plugins.push(
    new WebpackShellPlugin({
      onBuildEnd: ['./scripts/watch.js'],
    }),
  );
}

const serverConfig = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  entry: './src/server/index.tsx',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist', 'js'),
  },
  externals: nodeModules,
};

const clientConfig = {
  entry: './src/index.tsx',
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'dist', 'js'),
  },
};

module.exports = [
  Object.assign(serverConfig, base),
  Object.assign(clientConfig, base),
];
