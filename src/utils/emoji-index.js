import data from '../../data'

import { getSanitizedData, intersect } from '.'

var index = {}
var emojisList = {}
var emoticonsList = {}

for (let emoji in data.emojis) {
  let emojiData = data.emojis[emoji],
      { short_names, emoticons } = emojiData,
      id = short_names[0]

  for (let emoticon of (emoticons || [])) {
    if (!emoticonsList[emoticon]) {
      emoticonsList[emoticon] = id
    }
  }

  emojisList[id] = getSanitizedData(id)
}

function search(value, emojisToShowFilter = () => true, maxResults = 75) {
  var results = null

  if (value.length) {
    var values = value.toLowerCase().split(/[\s|,|\-|_]+/),
        allResults = []

    if (values.length > 2) {
      values = [values[0], values[1]]
    }

    allResults = values.map((value) => {
      var aPool = data.emojis,
          aIndex = index,
          length = 0

      if (value == '-' || value == '-1') {
        return [emojisList['-1']]
      }

      for (let char of value.split('')) {
        length++

        aIndex[char] || (aIndex[char] = {})
        aIndex = aIndex[char]

        if (!aIndex.results) {
          let scores = {}

          aIndex.results = []
          aIndex.pool = {}

          for (let id in aPool) {
            let emoji = aPool[id],
                { search } = emoji,
                sub = value.substr(0, length),
                subIndex = search.indexOf(sub)

            if (subIndex != -1) {
              let score = subIndex + 1
              if (sub == id) score = 0

              aIndex.results.push(emojisList[id])
              aIndex.pool[id] = emoji

              scores[id] = score
            }
          }

          aIndex.results.sort((a, b) => {
            var aScore = scores[a.id],
                bScore = scores[b.id]

            return aScore - bScore
          })
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

  let filtered_results = null;
  if (results) {
    filtered_results = results.filter(
      (result) => emojisToShowFilter(data.emojis[result.id].unified));
      if (filtered_results && filtered_results.length) {
        filtered_results = filtered_results.slice(0, maxResults)
      }
  }

  return filtered_results
}

export default { search, emojis: emojisList, emoticons: emoticonsList }
