import lunr from 'lunr'
import data from '../../data'

import {getSanitizedData} from '.'

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
      { short_name, name, emoticons } = emojiData

  for (let emoticon of emoticons) {
    if (!emoticonsList[emoticon]) {
      emoticonsList[emoticon] = short_name
    }
  }

  index.add({
    id: short_name,
    emoticons: emoticons,
    short_name: tokenize(short_name),
    name: tokenize(name),
  })
}

function search(value, maxResults = 75) {
  var results = null

  if (value.length) {
    results = index.search(tokenize(value)).map((result) =>
      getSanitizedData(result.ref)
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

export default { search, emoticons: emoticonsList }
