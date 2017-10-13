const env = require('../env.js');

exports.lintJS = {
  test: /\.js$/,
  exclude: /node_modules/,
  enforce: 'pre',
  loader: 'eslint-loader',
  options: env ? 
    {emitWarning: true} :
    {},
};