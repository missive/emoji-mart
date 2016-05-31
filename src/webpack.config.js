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
    ],
  },

  resolve: {
    extensions: ['', '.js'],
  },

  plugins: [],
  devtool: 'source-map',
  bail: true,
}
