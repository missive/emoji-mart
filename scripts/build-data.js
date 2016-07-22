var fs = require('fs'),
    emojiData = require('emoji-data'),
    emojiLib = require('emojilib'),
    inflection = require('inflection'),
    mkdirp = require('mkdirp'),
    uniq = require('uniq')

var categories = ['People', 'Nature', 'Foods', 'Activity', 'Places', 'Objects', 'Symbols', 'Flags'],
    data = { categories: [], emojis: {}, skins: {} },
    categoriesIndex = {}

categories.forEach((category, i) => {
  data.categories[i] = { name: category, emojis: [] }
  categoriesIndex[category] = i
})

emojiData.sort((a, b) => {
  var aTest = a.sort_order || a.short_name,
      bTest = b.sort_order || b.short_name

  return aTest - bTest
})

emojiData.forEach((datum) => {
  var category = datum.category,
      shortName = datum.short_name,
      keywords = [],
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

  datum.emoticons = datum.texts || []
  if (datum.text && !datum.emoticons.length) {
    datum.emoticons = [datum.text]
  }

  delete datum.text
  delete datum.texts

  if (emojiLib.lib[datum.short_name]) {
    keywords = emojiLib.lib[datum.short_name].keywords
  }

  datum.keywords = keywords
  datum.search = uniq([]
    .concat(datum.name.split(/[-|_|\s]+/))
    .concat(datum.short_names)
    .concat(datum.keywords)
    .concat(datum.emoticons)
    .map((s) => s.toLowerCase())
  ).join(',')

  if (datum.category == 'Skin Tones') {
    data.skins[datum.short_name] = datum
  } else {
    categoryIndex = categoriesIndex[category]
    data.categories[categoryIndex].emojis.push(datum.short_name)
    data.emojis[datum.short_name] = datum
  }

  delete datum.docomo
  delete datum.au
  delete datum.softbank
  delete datum.google
  delete datum.image
  delete datum.short_name
  delete datum.category
  delete datum.sort_order
})

var flags = data.categories[categoriesIndex['Flags']];
flags.emojis.sort()

mkdirp('data', (err) => {
  if (err) throw err

  fs.writeFile('data/index.js', `export default ${JSON.stringify(data)}`, (err) => {
    if (err) throw err
  })
})
