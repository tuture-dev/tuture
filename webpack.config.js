const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Watchpack = require('watchpack');

// get tuture path
const tuturePath = process.env.TUTURE_PATH;

const wp = new Watchpack({
  aggregateTimeout: 1000,
  poll: true,
  ignored: /node_modules/,
});

wp.watch([`${tuturePath}/tuture.yml`], [], Date.now() - 10000);

module.exports = {
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'dist/index.html',
    }),
    new CopyWebpackPlugin([
      {
        from: `${tuturePath}/.tuture/tuture.json`,
        to: './tuture.json',
      },
      {
        from: `${tuturePath}/.tuture/diff.json`,
        to: './diff.json',
      },
    ]),
    new webpack.NamedModulesPlugin(),
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
      },
    ],
  },
};
