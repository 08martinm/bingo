const path = require('path');
const env = require('../env.js');

exports.devServer =
  { 
    contentBase: path.join(__dirname, '../../public'),
    historyApiFallback: true,
    stats: 'normal',
    hot: env,
    overlay: {
      errors: env,
      warnings: env,
    },
  };
