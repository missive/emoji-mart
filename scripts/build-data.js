var fs = require('fs'),
    emojiData = require('emoji-datasource'),
    emojiLib = require('emojilib'),
    inflection = require('inflection'),
    mkdirp = require('mkdirp')

var unifiedToNative = unified => String.fromCodePoint(
  ...unified.split('-').map(s => parseInt(s, 16))
);

// Turn this:
//
//   "uruguay": {
//      "keywords": ["uy", "flag", "nation", "country", "banner"],
//      "char": "🇺🇾",
//      "fitzpatrick_scale": false,
//      "category": "flags"
//    },
//
// into this:
//
//   "🇺🇾": {
//      "name": "uruguay",
//      "keywords": ["uruguay", "uy", "flag", "nation", "country", "banner"],
//      "char": "🇺🇾",
//      "fitzpatrick_scale": false,
//      "category": "flags"
//    },
var emojiLibByChar = Object.keys(emojiLib.lib).reduce(
  (acc, shortName) => {
    var data = Object.assign({}, emojiLib.lib[shortName])

    data.keywords.unshift(shortName)
    data.name = shortName

    acc[data.char] = data

    return acc
  },
  {}
)

var categories = ['People', 'Nature', 'Foods', 'Activity', 'Places', 'Objects', 'Symbols', 'Flags'],
    data = { categories: [], emojis: {}, skins: {}, short_names: {} },
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
      keywords = [],
      categoryIndex,
      char = unifiedToNative(datum.unified),
      emojiLibMatch = emojiLibByChar[char]

  if (!datum.category) {
    throw new Error('“' + datum.short_name + '” doesn’t have a category')
  }

  datum.name || (datum.name = datum.short_name.replace(/\-/g, ' '))

  if (datum.category == 'Flags' && emojiLibMatch) {
    // prefer name from emojiLib ("Uruguay")
    // instead of emojiData ("REGIONAL INDICATOR SYMBOL LETTERS UY")
    datum.name = emojiLibMatch.name
  }

  datum.name = inflection.titleize(datum.name || '')

  if (datum.category == 'Flags') {
    // uppercase two-letter country codes
    datum.name = datum.name.replace(/\b[A-Z]([a-z])$/, letters => letters.toUpperCase())
  }

  if (!datum.name) {
    throw new Error('“' + datum.short_name + '” doesn’t have a name')
  }

  datum.emoticons = datum.texts || []
  datum.text = datum.text || ''
  delete datum.texts

  if (emojiLibMatch) {
    datum.keywords = emojiLibMatch.keywords
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
