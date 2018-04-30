const build = require('./build')
const sets = ['apple', 'emojione', 'facebook', 'google', 'messenger', 'twitter']

build({ output: 'data/all.json' })

sets.forEach((set) => {
  build({
    output: `data/${set}.json`,
    sets: [set],
  })
})
