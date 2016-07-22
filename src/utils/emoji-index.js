import data from '../../data'

import {getSanitizedData, intersect} from '.'

var index = {}
var emojisList = {}
var emoticonsList = {}

for (let emoji in data.emojis) {
  let emojiData = data.emojis[emoji],
      { short_names, emoticons } = emojiData,
      id = short_names[0]

  for (let emoticon of emoticons) {
    if (!emoticonsList[emoticon]) {
      emoticonsList[emoticon] = id
    }
  }

  emojisList[id] = getSanitizedData(id)
}

function search(value, maxResults = 75) {
  var results = null

  if (value.length) {
    var values = value.toLowerCase().split(/[\s|,]+/),
        allResults = []

    if (values.length > 2) {
      values = [values[0], values[1]]
    }

    allResults = values.map((value) => {
      var aPool = data.emojis,
          aIndex = index,
          length = 0

      for (let char of value.split('')) {
        length++

        aIndex[char] || (aIndex[char] = {})
        aIndex = aIndex[char]

        if (!aIndex.results) {
          aIndex.results = []
          aIndex.pool = {}

          for (let id in aPool) {
            let emoji = aPool[id],
                { search } = emoji

            if (search.indexOf(value.substr(0, length)) != -1) {
              aIndex.results.push(emojisList[id])
              aIndex.pool[id] = emoji
            }
          }
        }

        aPool = aIndex.pool
      }

      return aIndex.results
    }).filter(a => a)

    if (allResults.length > 1) {
      results = intersect(...allResults)
    } else if (allResults.length) {
      results = allResults[0]
    } else {
      results = []
    }
  }

  if (results) {
    results = results.slice(0, maxResults)
  }

  return results
}

export default { search, emojis: emojisList, emoticons: emoticonsList }
