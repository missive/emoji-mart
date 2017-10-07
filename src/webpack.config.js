var path = require('path')
var pack = require('../package.json')
var webpack = require('webpack')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

var PROD = process.env.NODE_ENV === 'production'
var TEST = process.env.NODE_ENV === 'test'

var config = {
  entry: path.resolve('src/index.js'),
  output: {
    path: path.resolve('dist'),
    filename: 'emoji-mart.js',
    library: 'EmojiMart',
    libraryTarget: 'umd',
  },

  externals: [],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [path.resolve('src'), path.resolve('data')],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'svg-jsx-loader',
            options: {
              es6: true,
            },
          },
        ],
        include: [path.resolve('src/svgs')],
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

if (!TEST) {
  config.externals = config.externals.concat([
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
    },
  ])

  config.plugins = config.plugins.concat([
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
  ])
}

module.exports = config
