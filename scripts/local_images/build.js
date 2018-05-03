var fs = require('fs'),
  emojiLib = require('emojilib'),
  inflection = require('inflection'),
  mkdirp = require('mkdirp')

var { compress } = require('../src/utils/data')

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

var sets = ['apple', 'emojione', 'facebook', 'google', 'messenger', 'twitter']

module.exports = (options) => {
  delete require.cache[require.resolve('emoji-datasource')]
  var emojiData = require('emoji-datasource')

  var data = { compressed: true, categories: [], emojis: {}, aliases: {} },
    categoriesIndex = {}

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

    var localImageSets = options.sets || sets

    // Local images
    datum.localImages = {}
    localImageSets.forEach((set) => {
      var key = `has_img_${set}`
      if (datum[key]) {
        datum.localImages[set] = [
          `require('../../../assets/emojis/img-${set}-64/${datum.image}')`,
        ]

        // Skin variations
        if (datum.skin_variations) {
          for (let skinKey in datum.skin_variations) {
            var skinVariations = datum.skin_variations[skinKey]
            if (skinVariations[key])
              datum.localImages[set].push(
                `require('../../../assets/emojis/img-${set}-64/${
                  skinVariations.image
                }')`,
              )
          }
        }
      }
    })

    if (options.sets) {
      var keepEmoji = false

      options.sets.forEach((set) => {
        if (keepEmoji) return

        if (datum[`has_img_${set}`]) {
          keepEmoji = true
        }
      })

      if (!keepEmoji) {
        return
      }

      sets.forEach((set) => {
        if (options.sets.length == 1 || options.sets.indexOf(set) == -1) {
          var key = `has_img_${set}`
          delete datum[key]
        }
      })
    } else {
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

    if (datum.category != 'Skin Tones') {
      categoryIndex = categoriesIndex[category]
      data.categories[categoryIndex].emojis.push(datum.short_name)
      data.emojis[datum.short_name] = datum
    }

    datum.short_names.forEach((short_name, i) => {
      if (i == 0) {
        return
      }

      data.aliases[short_name] = datum.short_name
    })

    delete datum.docomo
    delete datum.au
    delete datum.softbank
    delete datum.google
    delete datum.category
    delete datum.sort_order

    compress(datum)
  })

  var flags = data.categories[categoriesIndex['Flags']]
  flags.emojis = flags.emojis
    .filter((flag) => {
      // Until browsers support Flag UN
      if (flag == 'flag-un') return
      return true
    })
    .sort()

  var stingified = JSON.stringify(data)
    .replace(/\"([A-Za-z_]+)\":/g, '$1:')
    .replace(/(["'])require(?:(?=(\\?))\2.)*?\1/g, (value) =>
      value.replace(/"/g, ''),
    )

  fs.writeFile(options.output, `export default ${stingified}`, (err) => {
    if (err) throw err
  })
}
