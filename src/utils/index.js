import data from '../../data'

let blankDataURL;
let canvas;
let context;
let blankSymbol = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAmUlEQVRYR+3TMQuAIBiE4VdoqIbW/v/Pa2hqi4YQCiJClEMQOkfxg/PxDDS+QuP5cED1hSxoQVVAnXcHLagKqPO/7GC89AR0L70N2EtFawgOwAisjzBfe1lZHfBismBWXxJazQnOQPy19+qBA1hKbhrP1vgkpRmS5x1Q5bSgBVUBdd4dtKAqoM67gxZUBdR5d9CCqoA633wHT6b4Dymo8pz7AAAAAElFTkSuQmCC";
let doubleBlank = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAo0lEQVRYR+2VsQqAMBBDn+CgDq7+/+c5OLmJg1QQqoM3xIpgOjakTV/v2oqPj+rj+XBA9YZM0ARVAqrfNWiCKgHV/8saTIfugfpCbwYW2L/XO/1kK0GwBTpgynbK5yLdASNCkW6CEaFIf4XgAKSuPUYDrMAIpIB3evGA6tvsgCb4KAF1sRJfnZrJTWKCjxJQF3OTmKBKQPW7Bk1QJaD6XYMqwQ1Q5x4pJ4/Z7QAAAABJRU5ErkJggg=="
const COLONS_REGEX = /^(?:\:([^\:]+)\:)(?:\:skin-tone-(\d)\:)?$/
const SKINS = [
  '1F3FA', '1F3FB', '1F3FC',
  '1F3FD', '1F3FE', '1F3FF',
]

function unifiedToNative(unified) {
  var unicodes = unified.split('-'),
      codePoints = unicodes.map((u) => `0x${u}`)

  return String.fromCodePoint(...codePoints)
}

function clearCanvas() {
  if (canvas === undefined) {
    canvas = document.createElement('canvas')
    canvas.width = canvas.height = 40
    context = canvas.getContext('2d')
  }
  context.clearRect(0, 0, canvas.width, canvas.height)
}

function nativeIsSupported() {
  if (typeof document == 'undefined') return true
  var data = getSanitizedData(...arguments),
    { native } = data

  clearCanvas()
  context.fillText(native, 20, 20)
  let emojiString = canvas.toDataURL()
  let singleSymbolSupported = blankSymbol !== emojiString
  let doubleSymbolSupported = doubleBlank !== emojiString
  return singleSymbolSupported && doubleSymbolSupported
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

function getData(emoji, skin, set) {
  var emojiData = {}

  if (typeof emoji == 'string') {
    let matches = emoji.match(COLONS_REGEX)

    if (matches) {
      emoji = matches[1]

      if (matches[2]) {
        skin = parseInt(matches[2])
      }
    }

    if (data.short_names.hasOwnProperty(emoji)) {
      emoji = data.short_names[emoji]
    }

    if (data.emojis.hasOwnProperty(emoji)) {
      emojiData = data.emojis[emoji]
    }
  } else if (emoji.id) {
    if (data.short_names.hasOwnProperty(emoji.id)) {
      emoji.id = data.short_names[emoji.id]
    }

    if (data.emojis.hasOwnProperty(emoji.id)) {
      emojiData = data.emojis[emoji.id]
      skin || (skin = emoji.skin)
    }
  }

  if (emojiData.skin_variations && skin > 1 && set) {
    emojiData = JSON.parse(JSON.stringify(emojiData))

    var skinKey = SKINS[skin - 1],
        variationKey = `${emojiData.unified}-${skinKey}`,
        variationData = emojiData.skin_variations[variationKey]

    if (variationData[`has_img_${set}`]) {
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

function deepMerge(a, b) {
  var o = {}

  for (let key in a) {
    let originalValue = a[key],
        value = originalValue

    if (b.hasOwnProperty(key)) {
      value = b[key]
    }

    if (typeof value === 'object') {
      value = deepMerge(originalValue, value)
    }

    o[key] = value
  }

  return o
}

export { getData, getSanitizedData, intersect, deepMerge, unifiedToNative, nativeIsSupported }
