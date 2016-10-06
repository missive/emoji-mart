import data from '../../data'

const SKINS = [
  '1F3FA', '1F3FB', '1F3FC',
  '1F3FD', '1F3FE', '1F3FF',
]

var blankDataURL, canvas, context

function unifiedToNative(unified) {
  var unicodes = unified.split('-'),
      codePoints = unicodes.map((u) => `0x${u}`)

  return String.fromCodePoint(...codePoints)
}

function clearCanvas() {
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.width = canvas.height = 2

    context = canvas.getContext('2d')
    context.font = '2px Arial'
    context.textBaseline = 'top'

    blankDataURL = canvas.toDataURL()
  }

  context.clearRect(0, 0, canvas.width, canvas.height)
}

function nativeIsSupported() {
  if (typeof document == 'undefined') return true

  var data = getSanitizedData(...arguments),
      { native } = data

  clearCanvas()
  context.fillText(native, 0, 0)

  return blankDataURL != canvas.toDataURL()
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
  var emojiData = {}

  if (typeof emoji == 'string') {
    emojiData = data.emojis[emoji]
  } else if (emoji.id) {
    emojiData = data.emojis[emoji.id]
    skin || (skin = emoji.skin)
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

export { getData, getSanitizedData, intersect, nativeIsSupported }
