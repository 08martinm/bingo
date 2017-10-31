const path = require('path');
const env = require('../env.js');
const entryPath = path.resolve(__dirname, '../../src/index.js');

exports.entry = {
  array: true,
  name: 'entry',
  data: env ? 
    ['bootstrap-loader', 'react-hot-loader/patch', 'webpack-hot-middleware/client', entryPath] :
    ['bootstrap-loader', entryPath],
};
