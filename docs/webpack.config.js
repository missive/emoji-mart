var path = require('path')
var pack = require('../package.json')
var webpack = require('webpack')

var PROD = process.env.NODE_ENV === 'production'
var TEST = process.env.NODE_ENV === 'test'

var config = {
  entry: path.resolve('docs/index.js'),
  output: {
    path: path.resolve('docs'),
    filename: 'bundle.js',
    library: 'EmojiMart',
    libraryTarget: 'umd',
  },

  externals: [],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [
          path.resolve('src'),
          path.resolve('docs'),
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.js'],
  },

  plugins: [
    new webpack.DefinePlugin({
      EMOJI_DATASOURCE_VERSION: `'${pack.devDependencies['emoji-datasource']}'`,
    }),
  ],

  bail: true,
}

module.exports = config
