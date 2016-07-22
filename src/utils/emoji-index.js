import data from '../../data'

import {getSanitizedData} from '.'

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
    var aPool = data.emojis,
        aIndex = index,
        i = 0

    value = value.toLowerCase()

    for (let char of value.split('')) {
      i++

      aIndex[char] || (aIndex[char] = {})
      aIndex = aIndex[char]

      if (!aIndex.results) {
        aIndex.results = []
        aIndex.pool = {}

        for (let id in aPool) {
          let emoji = aPool[id],
              { search } = emoji

          if (search.indexOf(value.substr(0, i)) != -1) {
            aIndex.results.push(emojisList[id])
            aIndex.pool[id] = emoji
          }
        }
      }

      aPool = aIndex.pool
      results = aIndex.results.slice(0, maxResults)
    }
  }

  return results
}

export default { search, emojis: emojisList, emoticons: emoticonsList }
