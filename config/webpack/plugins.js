const env = require('../env.js');
const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const NamedModules = new webpack.NamedModulesPlugin();
const HMR = new webpack.HotModuleReplacementPlugin();
const NoEmit = new webpack.NoEmitOnErrorsPlugin();
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
    [HTMLWebpack, LoaderOptions, NamedModules, HMR, NoEmit] :
    [HTMLWebpack, LoaderOptions, ExtractText],
};
