var fs = require('fs'),
    emojiData = require('emoji-datasource'),
    emojiLib = require('emojilib'),
    inflection = require('inflection'),
    mkdirp = require('mkdirp')

var data = { categories: [], emojis: {}, skins: {}, short_names: {} },
    categoriesIndex = {}

var categories = [
  ['Smileys & People', 'people'],
  ['Animals & Nature', 'nature'],
  ['Food & Drink', 'foods'],
  ['Activities', 'activity'],
  ['Travel & Places', 'places'],
  ['Objects', 'objects'],
  ['Symbols', 'symbols'],
  ['Flags', 'flags'],
]

categories.forEach((category, i) => {
  let [name, id] = category
  data.categories[i] = { id: id, name: name, emojis: [] }
  categoriesIndex[name] = i
})

emojiData.sort((a, b) => {
  var aTest = a.sort_order || a.short_name,
      bTest = b.sort_order || b.short_name

  return aTest - bTest
})

emojiData.forEach((datum) => {
  var category = datum.category,
      keywords = [],
      categoryIndex

  if (!datum.category) {
    throw new Error('“' + datum.short_name + '” doesn’t have a category')
  }

  datum.name || (datum.name = datum.short_name.replace(/\-/g, ' '))
  datum.name = inflection.titleize(datum.name || '')

  if (!datum.name) {
    throw new Error('“' + datum.short_name + '” doesn’t have a name')
  }

  datum.emoticons = datum.texts || []
  datum.text = datum.text || ''
  delete datum.texts

  if (emojiLib.lib[datum.short_name]) {
    datum.keywords = emojiLib.lib[datum.short_name].keywords
  }

  if (datum.category == 'Skin Tones') {
    data.skins[datum.short_name] = datum
  } else {
    categoryIndex = categoriesIndex[category]
    data.categories[categoryIndex].emojis.push(datum.short_name)
    data.emojis[datum.short_name] = datum
  }

  datum.short_names.forEach((short_name, i) => {
    if (i == 0) { return }
    data.short_names[short_name] = datum.short_name
  })

  datum.short_names = datum.short_names.filter(i => i !== datum.short_name)
  datum.sheet = [datum.sheet_x, datum.sheet_y]

  if (datum.text === '') delete datum.text
  if (datum.added_in === '6.0') delete datum.added_in

  delete datum.docomo
  delete datum.au
  delete datum.softbank
  delete datum.google
  delete datum.image
  delete datum.short_name
  delete datum.category
  delete datum.sort_order
  delete datum.sheet_x
  delete datum.sheet_y

  for (let key in datum) {
    let value = datum[key]

    if (Array.isArray(value) && !value.length) {
      delete datum[key]
    }
  }
})

var flags = data.categories[categoriesIndex['Flags']]
flags.emojis = flags.emojis.filter((flag) => {
  // Until browsers support Flag UN
  if (flag == 'flag-un') return
  return true
}).sort()

const stringified = JSON.stringify(data).replace(/\"([A-Za-z_]+)\":/g, '$1:')
fs.writeFile('src/data/data.js', `export default ${stringified}`, (err) => {
  if (err) throw err
})
