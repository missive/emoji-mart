var path = require('path')
var pack = require('../package.json')
var webpack = require('webpack')

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
          path.resolve('node_modules/measure-scrollbar'),
          path.resolve('data'),
          path.resolve('example'),
        ],
      },
      {
        test: /\.svg$/,
        loaders: ['babel?presets[]=react', 'svg-jsx?es6=true'],
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
}
