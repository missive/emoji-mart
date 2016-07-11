var path = require('path')

module.exports = {
  entry: path.resolve('src/index.js'),
  output: {
    path: path.resolve('dist'),
    filename: 'emoji-picker.js',
    library: 'EmojiPicker',
    libraryTarget: 'umd',
  },

  externals: [
    'react',
  ],

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

  plugins: [],
  bail: true,
}
