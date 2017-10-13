const env = require('../env.js');

exports.loadImages = {
  test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf)$/,
  use: [{
    loader: env ? 'url-loader' : 'file-loader',
    options: {limit: 25000, name: './images/[hash].[ext]'},
  }],
};
