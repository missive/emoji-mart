var path = require('path')
var webpack = require('webpack')

var config = require('../example/webpack.config.js'),
    compiler = webpack(config)

compiler.watch({}, (err, stats) => {
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
