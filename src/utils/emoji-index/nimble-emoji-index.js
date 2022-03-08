import { getData, getSanitizedData, intersect } from '..'
import { uncompress } from '../data'
import store from '../store'

export default class NimbleEmojiIndex {
  constructor(data, set) {
    if (data.compressed) {
      // mutates data to uncompressed
      uncompress(data)
    }

    this.data = data || {}
    this.set = set || null
    this.originalPool = {}
    this.index = {}
    this.emojis = {}
    this.emoticons = {}
    this.customEmojisList = []

    this.buildIndex()
  }

  buildIndex() {
    for (let emoji in this.data.emojis) {
      let emojiData = this.data.emojis[emoji],
        { short_names, emoticons, skin_variations } = emojiData,
        id = short_names[0]

      if (emoticons) {
        emoticons.forEach((emoticon) => {
          if (this.emoticons[emoticon]) {
            return
          }

          this.emoticons[emoticon] = id
        })
      }

      // If skin variations include them
      if (skin_variations) {
        this.emojis[id] = {}
        for (let skinTone = 1; skinTone <= 6; skinTone++) {
          this.emojis[id][skinTone] = getSanitizedData(
            { id, skin: skinTone },
            skinTone,
            this.set,
            this.data,
          )
        }
      } else {
        this.emojis[id] = getSanitizedData(id, null, this.set, this.data)
      }

      this.originalPool[id] = emojiData
    }
  }

  clearCustomEmojis(pool) {
    this.customEmojisList.forEach((emoji) => {
      let emojiId = emoji.id || emoji.short_names[0]

      delete pool[emojiId]
      delete this.emojis[emojiId]
    })
  }

  addCustomToPool(custom, pool) {
    if (this.customEmojisList.length) this.clearCustomEmojis(pool)

    custom.forEach((emoji) => {
      let emojiId = emoji.id || emoji.short_names[0]

      if (emojiId && !pool[emojiId]) {
        pool[emojiId] = getData(emoji, null, null, this.data)
        this.emojis[emojiId] = getSanitizedData(emoji, null, null, this.data)
      }
    })

    this.customEmojisList = custom
    this.index = {}
  }

  search(
    value,
    { emojisToShowFilter, maxResults, include, exclude, custom = [] } = {},
  ) {
    // adds custom emojis to search
    if (this.customEmojisList != custom)
      this.addCustomToPool(custom, this.originalPool)

    const skinTone = store.get('skin') || 1

    // initialize default values, can be done in options
    maxResults || (maxResults = 75)
    include || (include = [])
    exclude || (exclude = [])

    var results = null,
      pool = this.originalPool

    if (value.length) {
      if (value == '-' || value == '-1') {
        return [this.emojis['-1'][skinTone]]
      }

      var values = value.toLowerCase().split(/[\s|,|\-|_]+/),
        allResults = []

      // only support 2 keywords? probably otherwise no results when intersecting
      if (values.length > 2) {
        values = [values[0], values[1]]
      }

      // limit searching to only certain categories
      if (include.length || exclude.length) {
        pool = {}

        this.data.categories.forEach((category) => {
          let isIncluded =
            include && include.length ? include.indexOf(category.id) > -1 : true
          let isExcluded =
            exclude && exclude.length
              ? exclude.indexOf(category.id) > -1
              : false
          if (!isIncluded || isExcluded) {
            return
          }

          category.emojis.forEach(
            (emojiId) => (pool[emojiId] = this.data.emojis[emojiId]),
          )
        })

        if (custom.length) {
          let customIsIncluded =
            include && include.length ? include.indexOf('custom') > -1 : true
          let customIsExcluded =
            exclude && exclude.length ? exclude.indexOf('custom') > -1 : false
          if (customIsIncluded && !customIsExcluded) {
            this.addCustomToPool(custom, pool)
          }
        }
      }

      // loop through keywords
      allResults = values
        .map((value) => {
          var aPool = pool,
            aIndex = this.index,
            length = 0

          // loop over each character in keyword
          for (let charIndex = 0; charIndex < value.length; charIndex++) {
            const char = value[charIndex]
            length++

            // get documents with indexed character
            // looks like the index is used to optimize the subsequent searches
            aIndex[char] || (aIndex[char] = {})
            aIndex = aIndex[char]

            // if no results cached from previous searches, perform a search for the character
            if (!aIndex.results) {
              let scores = {}

              aIndex.results = []
              aIndex.pool = {}

              // only search based on the id attribute
              for (let id in aPool) {
                let emoji = aPool[id],
                  // has a field called search where data.js adds all the searchable fields
                  { search } = emoji,
                  sub = value.substr(0, length),
                  subIndex = search.indexOf(sub)

                if (subIndex != -1) {
                  // scoring is done based on how close the character is to the start of the search field
                  // this means that the first fields to be added are higher priority
                  // and string occuring later naturally have a lower priority.
                  // A lower score means higher priority
                  let score = subIndex + 1
                  if (sub == id) score = 0

                  // multiple skin tons can match too, picks a single one
                  if (this.emojis[id] && this.emojis[id][skinTone]) {
                    aIndex.results.push({
                      ...this.emojis[id][skinTone],
                      score,
                      search,
                    })
                  } else {
                    aIndex.results.push({ ...this.emojis[id], score, search })
                  }
                  aIndex.pool[id] = emoji

                  scores[id] = score
                }
              }

              aIndex.results.sort((a, b) => {
                var aScore = scores[a.id],
                  bScore = scores[b.id]

                if (aScore == bScore) {
                  return a.id.localeCompare(b.id)
                } else {
                  return aScore - bScore
                }
              })
            }

            aPool = aIndex.pool
          }

          // results don't include the score
          return aIndex.results
        })
        .filter((a) => a)

      if (allResults.length > 1) {
        results = intersect.apply(null, allResults)
      } else if (allResults.length) {
        results = allResults[0]
      } else {
        results = []
      }
    }

    // filter results down to maxResults and custom filtering
    if (results) {
      if (emojisToShowFilter) {
        results = results.filter((result) =>
          emojisToShowFilter(pool[result.id]),
        )
      }

      if (results && results.length > maxResults) {
        results = results.slice(0, maxResults)
      }
    }

    return results
  }
}
