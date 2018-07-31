const path = require('path');

module.exports = (env, argv) => {
  const base = {
    entry: './src/server/index.tsx',
    output: {
      filename: 'js/server.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    devtool: 'cheap-module-eval-source-map',
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
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

  if (env.platform === 'server') {
    base.target = 'node';
  }

  if (env.platform === 'web') {
    base.entry = './src/index.tsx';
    base.output.filename = 'js/client.js';
  }

  return base;
};
