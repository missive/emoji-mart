import data from '../../data'

const SKINS = [
  '1F3FA', '1F3FB', '1F3FC',
  '1F3FD', '1F3FE', '1F3FF',
]

function unifiedToNative(unified) {
  var unicodes = unified.split('-'),
      codePoints = unicodes.map((u) => `0x${u}`)

  return String.fromCodePoint(...codePoints)
}

function sanitize(emoji) {
  var { name, short_names, skin_tone, skin_variations, emoticons, unified } = emoji,
      id = short_names[0],
      colons = `:${id}:`

  if (skin_tone) {
    colons += `:skin-tone-${skin_tone}:`
  }

  return {
    id,
    name,
    colons,
    emoticons,
    skin: skin_tone || skin_variations ? 1 : null,
    native: unifiedToNative(unified),
  }
}

function getSanitizedData() {
  return sanitize(getData(...arguments))
}

function getData(emoji, skin, sheetURL) {
  var emojiData = {},
      _emojiData = null

  if (typeof emoji == 'string') {
    if (_emojiData = data.emojis[emoji]) {
      emojiData = _emojiData
    }
  } else if (emoji.id) {
    if (_emojiData = data.emojis[emoji.id]) {
      emojiData = _emojiData
      skin || (skin = emoji.skin)
    }
  }

  if (emojiData.skin_variations && skin > 1 && sheetURL) {
    emojiData = JSON.parse(JSON.stringify(emojiData))

    var skinKey = SKINS[skin - 1],
        variationKey = `${emojiData.unified}-${skinKey}`,
        variationData = emojiData.skin_variations[variationKey],
        kitMatches = sheetURL.match(/(apple|google|twitter|emojione)/),
        kit = kitMatches[0]

    if (variationData[`has_img_${kit}`]) {
      emojiData.skin_tone = skin

      for (let k in variationData) {
        let v = variationData[k]
        emojiData[k] = v
      }
    }
  }

  return emojiData
}

function intersect(a, b) {
  var aSet = new Set(a),
      bSet = new Set(b),
      intersection = null

  intersection = new Set(
    [...aSet].filter(x => bSet.has(x))
  )

  return Array.from(intersection)
}

export { getData, getSanitizedData, intersect }
