const babel = require('@babel/core')

module.exports = {
  process(src) {
    const transform = babel.transform(src, {
      babelrc: false,
      compact: false,
      plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
    })

    return transform
  },
}
