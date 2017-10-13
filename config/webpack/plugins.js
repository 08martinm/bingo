const env = require('../env.js');
const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const HMR = new webpack.HotModuleReplacementPlugin();
const NamedModules = new webpack.NamedModulesPlugin();
const ExtractText = new ExtractTextPlugin({filename: '[name].[contenthash].css'});

const HTMLWebpack = new HTMLWebpackPlugin({
  filename: path.join(__dirname, '../../public/index.html'),
  template: './src/index.html',
  favicon: path.join(__dirname, '../../static/favicon.ico'),
});

const LoaderOptions = new webpack.LoaderOptionsPlugin({
  options: {
    eslint: {
      failOnWarning: false,
      failOnError: true,
      fix: false,
    },
  },
});

exports.plugins = {
  array: true,
  name: 'plugins',
  data: env ? 
    [HTMLWebpack, LoaderOptions, HMR, NamedModules] :
    [HTMLWebpack, LoaderOptions, ExtractText],
};
