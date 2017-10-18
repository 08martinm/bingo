const parts = require('./config/webpack.parts');
const env = require('./config/env.js');

process.env.BABEL_ENV === env ? 'development' : 'production';

let stats = !env ? 'normal' :
  {
    hash: false,
    version: false,
    timings: false,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: false,
    errorDetails: false,
    warnings: false,
    publicPath: false,
  };

module.exports = {
  entry: parts.entry,
  output: parts.output,
  stats: stats,

  plugins: parts.plugins,
  devtool: parts.devtool,
  devServer: parts.devServer,

  module: {
    rules: [
      parts.lintCSS,
      parts.loadCSS,
      parts.lintJS,
      parts.loadJS,
      parts.loadImages,
    ],
  },
};
