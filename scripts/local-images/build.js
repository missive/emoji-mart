var fs = require('fs'),
  emojiLib = require('emojilib'),
  inflection = require('inflection'),
  mkdirp = require('mkdirp')

var { compress } = require('../../src/utils/data')

var sets = ['apple', 'emojione', 'facebook', 'google', 'messenger', 'twitter']

module.exports = (options) => {
  delete require.cache[require.resolve('emoji-datasource')]
  var emojiData = require('emoji-datasource')

  var data = { compressed: true, emojis: {} }

  emojiData.sort((a, b) => {
    var aTest = a.sort_order || a.short_name,
      bTest = b.sort_order || b.short_name

    return aTest - bTest
  })

  emojiData.forEach((datum) => {
    var keywords = []

    var localImageSets = options.sets || sets

    // Local images
    datum.localImages = {}
    localImageSets.forEach((set) => {
      var key = `has_img_${set}`
      if (datum[key]) {
        datum.localImages[set] = [`require('./img-${set}-64/${datum.image}')`]

        // Skin variations
        if (datum.skin_variations) {
          for (let skinKey in datum.skin_variations) {
            var skinVariations = datum.skin_variations[skinKey]
            if (skinVariations[key])
              datum.localImages[set].push(
                `require('./img-${set}-64/${skinVariations.image}')`,
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

    data.emojis[datum.short_name] = datum

    delete datum.docomo
    delete datum.au
    delete datum.softbank
    delete datum.google
    delete datum.category
    delete datum.sort_order

    compress(datum)
  })

  var stingified = JSON.stringify(data)
    .replace(/\"([A-Za-z_]+)\":/g, '$1:')
    .replace(/(["'])require(?:(?=(\\?))\2.)*?\1/g, (value) =>
      value.replace(/"/g, ''),
    )

  fs.writeFile(options.output, `export default ${stingified}`, (err) => {
    if (err) throw err
  })
}
