const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default;

// get tuture path
const tuturePath = process.env.TUTURE_PATH;

module.exports = {
  entry: [
    './scripts/polyfills.js',
    './src/index.tsx',
  ],
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  plugins: [
    new WatchExternalFilesPlugin({
      files: [
        `${tuturePath}/tuture.yml`,
      ],
    }),
    new CopyWebpackPlugin([
      { from: `${tuturePath}/tuture.yml`, to: './tuture.yml' },
      { from: `${tuturePath}/.tuture/diff`, to: './diff' },
    ]),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
};
