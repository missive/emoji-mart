var fs = require('fs')
var emojiData = require('emoji-data')
var inflection = require('inflection')
var mkdirp = require('mkdirp')

var categories = ['People', 'Nature', 'Foods', 'Activity', 'Places', 'Objects', 'Symbols', 'Flags']
var data = { categories: [], emojis: {}, skins: {} }
var categoriesIndex = {}

categories.forEach((category, i) => {
  data.categories[i] = { name: category, emojis: [] }
  categoriesIndex[category] = i
})

emojiData.sort((a, b) => {
  var aTest = a.sort_order || a.short_name
  var bTest = b.sort_order || b.short_name

  return aTest - bTest
})

emojiData.forEach((datum) => {
  var category = datum.category,
      shortName = datum.short_name,
      categoryIndex

  if (!datum.category) {
    throw new Error('“' + datum.short_name + '” doesn’t have a category')
  }

  datum.name || (datum.name = datum.short_name.replace(/\-/g, ' '))
  datum.name = inflection.titleize(datum.name || '')

  if (datum.category == 'Flags') {
    datum.name = datum.name.replace(/\s(\w+)$/, (letters) => letters.toUpperCase())
  }

  if (!datum.name) {
    throw new Error('“' + datum.short_name + '” doesn’t have a name')
  }

  if (datum.category == 'Skin Tones') {
    data.skins[datum.short_name] = datum
  } else {
    categoryIndex = categoriesIndex[category]
    data.categories[categoryIndex].emojis.push(datum.short_name)
    data.emojis[datum.short_name] = datum
  }
})

var flags = data.categories[categoriesIndex['Flags']];
flags.emojis.sort()

mkdirp('data', (err) => {
  if (err) throw err

  fs.writeFile('data/index.js', `export default ${JSON.stringify(data)}`, (err) => {
    if (err) throw err
  })
})
