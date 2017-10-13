exports.lintCSS = {
  test: /\.css$/,
  exclude: /node_modules/,
  enforce: 'pre',
  loader: 'postcss-loader',
  options: {
    plugins: () => ([
      require('stylelint')(),
    ]),
  },
};
