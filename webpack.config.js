const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackReplacePlugin = require('html-replace-webpack-plugin');

module.exports = {
  entry: './assets/alchemicats.js',
  output: {
    filename: 'assets/alchemicats.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      minify: false,
      inject: 'body',
      scriptLoading: 'blocking',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './assets', to: 'assets' },
        { from: './public', to: 'public' },
        { from: './leaf', to: 'leaf' },
        { from: '*.png', to: '' },
        { from: './favicon.ico', to: '' },
        { from: './LICENSE', to: '' },
        { from: './robot.txt', to: '' },
        { from: './README.md', to: '' },
      ],
    }),
    new HtmlWebpackReplacePlugin({
      pattern: '<script type="text/javascript" src="assets/alchemicats.js"></script>',
      replacement: '<script src="assets/alchemicats.min.js"></script>',
    }),
  ],
};
