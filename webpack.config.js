const path = require('path');

module.exports = {
  entry: './scripts/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'eval-cheap-module-source-map',
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  watch: true
};