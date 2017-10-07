const path = require('path')
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  config.module.rules = [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      include: [
        path.resolve(__dirname, '../stories'),
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '../data'),
      ],
    },
    {
      test: /\.svg$/,
      loaders: ['babel-loader?presets[]=react', 'svg-jsx-loader?es6=true'],
      include: [
        path.resolve(__dirname, '../src/svgs'),
      ],
    },
    {
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader' ],
      include: [
        path.resolve(__dirname, '../css'),
      ],
    },
  ];

  config.devtool.sourcemaps = {
    enabled: false,
  };

  return config;
};
