import data from '../data'
import { getData, getSanitizedData, uniq } from '.'

var index = {}
var emojisList = {}
var emoticonsList = {}
var previousInclude = []
var previousExclude = []

for (let emoji in data.emojis) {
  let emojiData = data.emojis[emoji],
      { short_names, emoticons } = emojiData,
      id = short_names[0]

  if (emoticons) {
    emoticons.forEach(emoticon => {
      if (emoticonsList[emoticon]) {
        return
      }

      emoticonsList[emoticon] = id
    })
  }

  emojisList[id] = getSanitizedData(id)
}

function search(value, { emojisToShowFilter, maxResults, include, exclude, custom = [] } = {}) {
  maxResults || (maxResults = 75)
  include || (include = [])
  exclude || (exclude = [])

  custom.forEach(emoji => {
    data.emojis[emoji.id] = getData(emoji)
    emojisList[emoji.id] = getSanitizedData(emoji)
  })

  if (custom.length) {
    data.categories.push({
      name: 'Custom',
      emojis: custom.map(emoji => emoji.id)
    })
  }

  var results = null,
      pool = data.emojis

  if (value.length) {
    if (value == '-' || value == '-1') {
      return [emojisList['-1']]
    }

    var values = value.toLowerCase().split(/[\s|,|\-|_]+/),
        allResults = []

    if (values.length > 2) {
      values = [values[0], values[1]]
    }

    if (include.length || exclude.length) {
      pool = {}

      if (previousInclude != include.sort().join(',') || previousExclude != exclude.sort().join(',')) {
        previousInclude = include.sort().join(',')
        previousExclude = exclude.sort().join(',')
        index = {}
      }

      data.categories.forEach(category => {
        let isIncluded = include && include.length ? include.indexOf(category.name.toLowerCase()) > -1 : true
        let isExcluded = exclude && exclude.length ? exclude.indexOf(category.name.toLowerCase()) > -1 : false
        if (!isIncluded || isExcluded) {
          return
        }

        category.emojis.forEach(emojiId => pool[emojiId] = data.emojis[emojiId])
      })
    } else if (previousInclude.length || previousExclude.length) {
      index = {}
    }

    allResults = values.map((value) => {
      var aPool = pool,
          aIndex = index,
          length = 0

      for (let charIndex = 0; charIndex < value.length; charIndex++) {
        const char = value[charIndex]
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
      results = uniq(allResults)
    } else if (allResults.length) {
      results = allResults[0]
    } else {
      results = []
    }
  }

  if (results) {
    if (emojisToShowFilter) {
      results = results.filter((result) => emojisToShowFilter(data.emojis[result.id].unified))
    }

    if (results && results.length > maxResults) {
      results = results.slice(0, maxResults)
    }
  }

  return results
}

export default { search, emojis: emojisList, emoticons: emoticonsList }
