const path = require('path');
const env = require('../env.js');

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

exports.devServer =
  { 
    contentBase: path.join(__dirname, '../../public'),
    historyApiFallback: true,
    stats: stats,
    hot: env,
    overlay: {
      errors: env,
      warnings: env,
    },
  };
