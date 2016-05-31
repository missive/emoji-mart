var path = require('path')
var extend = require('util')._extend
var webpack = require('webpack')

var configs = ['development', 'production'].map((env) => {
  var configPath = '../src/webpack.config.js',
      config = require(configPath)

  delete require.cache[require.resolve(configPath)]

  if (env === 'production') {
    config.output.filename = config.output.filename.replace(/\.js$/, '.min.js')
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compressor: { warnings: false }
      })
    )
  }

  return config
})

webpack(configs, (err, stats) => {
  if (err) throw err

  console.log(
    stats.toString({
      colors: true,
      hash: true,
      version: false,
      timings: true,
      assets: true,
      chunks: false,
      chunkModules: false,
      modules: false,
      children: false,
      cached: false,
      reasons: false,
      source: false,
      errorDetails: false,
      chunkOrigins: false,
    })
  )
})
