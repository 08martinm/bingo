const path = require('path');
const env = require('../env.js');

exports.devServer =
  { 
    contentBase: path.join(__dirname, '../../public'),
    historyApiFallback: true,
    stats: !env ? 'normal' : {warnings: false},
    hot: env,
    overlay: {
      errors: env,
      warnings: env,
    },
  };
