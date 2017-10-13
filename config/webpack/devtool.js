const env = require('../env.js');

exports.devtool = env ?
  'eval-source-map' :
  'source-map';
