// @ts-nocheck
import { Store } from '../helpers'

const DEFAULTS = [
  '+1',
  'grinning',
  'kissing_heart',
  'heart_eyes',
  'laughing',
  'stuck_out_tongue_winking_eye',
  'sweat_smile',
  'joy',
  'scream',
  'disappointed',
  'unamused',
  'weary',
  'sob',
  'sunglasses',
  'heart',
]

function add(emoji: { id: string }) {
  const frequently = Store.get('frequently') || {}

  const emojiId = emoji.id || emoji
  if (!emojiId) return

  frequently[emojiId] || (frequently[emojiId] = 0)
  frequently[emojiId] += 1

  Store.set('last', emojiId)
  Store.set('frequently', frequently)
}

function get({ maxFrequentRows, perLine }) {
  if (!maxFrequentRows) return []

  const frequently = Store.get('frequently')
  let emojiIds = []

  if (!frequently) {
    frequently = {}

    for (let i in DEFAULTS.slice(0, perLine)) {
      const emojiId = DEFAULTS[i]

      frequently[emojiId] = perLine - i
      emojiIds.push(emojiId)
    }

    return emojiIds
  }

  const max = maxFrequentRows * perLine
  const last = Store.get('last')

  for (let emojiId in frequently) {
    emojiIds.push(emojiId)
  }

  emojiIds.sort((a, b) => {
    const aScore = frequently[b]
    const bScore = frequently[a]

    if (aScore == bScore) {
      return a.localeCompare(b)
    }

    return aScore - bScore
  })

  if (emojiIds.length > max) {
    const removedIds = emojiIds.slice(max)
    emojiIds = emojiIds.slice(0, max)

    for (let removedId of removedIds) {
      if (removedId == last) continue
      delete frequently[removedId]
    }

    if (last && emojiIds.indexOf(last) == -1) {
      delete frequently[emojiIds[emojiIds.length - 1]]
      emojiIds.splice(-1, 1, last)
    }

    Store.set('frequently', frequently)
  }

  return emojiIds
}

export default { add, get, DEFAULTS }
