import lunr from 'lunr'
import data from '../../data'

import {getSanitizedData} from '.'

var emojisList = {}
var emoticonsList = {}

var index = lunr(function() {
  this.pipeline.reset()

  this.field('short_name', { boost: 2 })
  this.field('emoticons')
  this.field('name')

  this.ref('id')
})

for (let emoji in data.emojis) {
  let emojiData = data.emojis[emoji],
      { short_names, name, emoticons } = emojiData,
      id = short_names[0]

  for (let emoticon of emoticons) {
    if (!emoticonsList[emoticon]) {
      emoticonsList[emoticon] = id
    }
  }

  emojisList[id] = getSanitizedData(id)

  index.add({
    id: id,
    emoticons: emoticons,
    short_name: tokenize(id),
    name: tokenize(name),
  })
}

function search(value, maxResults = 75) {
  var results = null

  if (value.length) {
    results = index.search(tokenize(value)).map((result) =>
      emojisList[result.ref]
    )

    results = results.slice(0, maxResults)
  }

  return results
}

function tokenize (string = '') {
  if (string[0] == '-' || string[0] == '+') {
    return string.split('')
  }

  if (/(:|;|=)-/.test(string)) {
    return [string]
  }

  return string.split(/[-|_|\s]+/)
}

export default { search, emojis: emojisList, emoticons: emoticonsList }
