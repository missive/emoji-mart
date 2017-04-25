const extend = require('util')._extend

import data from '../../data'
import { getSanitizedData, intersect } from '.'

class eIndex{

  constructor(){
    this.data = data;
    this.initialize();
  }
  updateData(d){
    this.data = d;
    this.initialize();
  }
  initialize(){

    this.index = {}
    this.emojisList = {}
    this.emoticonsList = {}

    for (let emoji in this.data.emojis) {
      let emojiData = this.data.emojis[emoji],
          { short_names, emoticons } = emojiData,
          id = short_names[0]

      for (let emoticon of (emoticons || [])) {
        if (!this.emoticonsList[emoticon]) {
          this.emoticonsList[emoticon] = id
        }
      }

      this.emojisList[id] = getSanitizedData(id)
    }
  }

    search(value, { emojisToShowFilter, maxResults, include, exclude } = {}) {
      maxResults || (maxResults = 75)

      var results = null,
          pool = this.data.emojis

      if (value.length) {
        var values = value.toLowerCase().split(/[\s|,|\-|_]+/),
            allResults = []

        if (values.length > 2) {
          values = [values[0], values[1]]
        }

        if ((include && include.length) || (exclude && exclude.length)) {
          pool = {}

          for (let category of this.data.categories) {
            let isIncluded = include == undefined ? true : include.indexOf(category.name.toLowerCase()) > -1
            let isExcluded = exclude == undefined ? false : exclude.indexOf(category.name.toLowerCase()) > -1
            if (!isIncluded || isExcluded) { continue }

            for (let emojiId of category.emojis) {
              pool[emojiId] = this.data.emojis[emojiId]
            }
          }
        }

        allResults = values.map((value) => {
          var aPool = pool,
              aIndex = this.index,
              length = 0

          if (value == '-' || value == '-1') {
            return [this.emojisList['-1']]
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

                  aIndex.results.push(this.emojisList[id])
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

      if (results) {
        if (emojisToShowFilter) {
          results = results.filter((result) => emojisToShowFilter(this.data.emojis[result.id].unified))
        }

        if (results && results.length > maxResults) {
          results = results.slice(0, maxResults)
        }
      }
      return results;
    }
    getObjects(){
      return {emojis: emojisList, emoticons: emoticonsList};
    }
}
export default new eIndex;
