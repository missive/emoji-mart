import { init, Data } from '../config'

const SHORTCODES_REGEX = /^(?:\:([^\:]+)\:)(?:\:skin-tone-(\d)\:)?$/
let Pool = null

function get(emojiId) {
  if (emojiId.id) {
    return emojiId
  }

  return (
    Data.emojis[emojiId] ||
    Data.emojis[Data.aliases[emojiId]] ||
    Data.emojis[Data.natives[emojiId]]
  )
}

function reset() {
  Pool = null
}

async function search(value, { maxResults } = {}) {
  if (!value || !value.trim().length) return null
  maxResults || (maxResults = 90)

  await init()

  const values = value
    .toLowerCase()
    .replace(/(\w)-/, '$1 ')
    .split(/[\s|,]+/)
    .filter((word, i, words) => {
      return word.trim() && words.indexOf(word) == i
    })

  if (!values.length) return

  let pool = Pool || (Pool = Object.values(Data.emojis))
  let results, scores

  for (const value of values) {
    if (!pool.length) break

    results = []
    scores = {}

    for (const emoji of pool) {
      if (!emoji.search) continue
      const score = emoji.search.indexOf(`,${value}`)
      if (score == -1) continue

      results.push(emoji)
      scores[emoji.id] || (scores[emoji.id] = 0)
      scores[emoji.id] += emoji.id == value ? 0 : score + 1
    }

    pool = results
  }

  if (results.length < 2) {
    return results
  }

  results.sort((a, b) => {
    const aScore = scores[a.id]
    const bScore = scores[b.id]

    if (aScore == bScore) {
      return a.id.localeCompare(b.id)
    }

    return aScore - bScore
  })

  if (results.length > maxResults) {
    results = results.slice(0, maxResults)
  }

  return results
}

export default { search, get, reset, SHORTCODES_REGEX }
