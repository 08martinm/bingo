const path = require('path');

exports.output = {
  filename: 'bundle.js',
  publicPath: '/',
  path: path.resolve(__dirname, '../../public'),
};
