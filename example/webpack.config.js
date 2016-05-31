var path = require('path')

module.exports = {
  entry: path.resolve('example/index.js'),
  output: {
    path: path.resolve('build'),
    filename: 'example.js',
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
    ],
  },

  resolve: {
    extensions: ['', '.js'],
  },
}
