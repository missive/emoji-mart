const build = require('./build')
const sets = ['apple', 'emojione', 'facebook', 'google', 'messenger', 'twitter']

build({ output: 'data/all.js' })

sets.forEach((set) => {
  build({
    output: `data/${set}.js`,
    sets: [set],
  })
})
