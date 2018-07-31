const path = require('path');

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
};

const serverConfig = {
  target: 'node',
  entry: './src/server/index.tsx',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist', 'js'),
  },
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
