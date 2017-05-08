var path = require('path')
var pack = require('../package.json')
var webpack = require('webpack')

var PROD = process.env.NODE_ENV === 'production';
var TEST = process.env.NODE_ENV === 'test';

module.exports = {
  entry: path.resolve('src/index.js'),
  output: {
    path: path.resolve('dist'),
    filename: 'emoji-mart.js',
    library: 'EmojiMart',
    libraryTarget: 'umd',
  },

  externals: !TEST && [{
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
  }],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve('src'),
          path.resolve('data'),
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline?removeSVGTagAttrs=false',
        include: [
          path.resolve('src/svgs'),
        ],
      },
    ],
  },

  resolve: {
    extensions: ['', '.js'],
  },

  plugins: [
    new webpack.DefinePlugin({
      EMOJI_DATASOURCE_VERSION: `'${pack.devDependencies['emoji-datasource']}'`,
    }),
  ],

  bail: true,
}
