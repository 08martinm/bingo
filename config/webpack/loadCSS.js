const env = require('../env.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const styleLoader = {
  loader: 'style-loader',
  options: {
    sourceMap: true,
    convertToAbsoluteUrls: true,
  },
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    modules: true,
    importLoaders: 1,
    localIdentName: '[name]_[local]_[hash:base64:5]',
  },
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: () => ([
      require('autoprefixer')(),
      require('precss')(),
    ]),
  },
};

exports.loadCSS = {
  test: /\.(css|scss)$/,
  use: env ? 
    [styleLoader, cssLoader, 'resolve-url-loader', postcssLoader, 'sass-loader'] :

    ExtractTextPlugin.extract({ 
      fallback: 'style-loader', 
      use: [cssLoader, 'resolve-url-loader', postcssLoader, 'sass-loader'],
    }),
};
