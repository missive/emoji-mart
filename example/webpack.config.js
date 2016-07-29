var path = require('path')

module.exports = {
  entry: path.resolve('example/index.js'),
  output: {
    path: path.resolve('example'),
    filename: 'bundle.js',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve('src'),
          path.resolve('data'),
          path.resolve('example'),
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline',
        include: [
          path.resolve('src/svgs'),
        ],
      },
    ],
  },

  resolve: {
    extensions: ['', '.js'],
  },
}
