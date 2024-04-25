const { mkdir, writeFile, rmSync } = require('fs')

const inflection = require('inflection')
const emojiLib = require('emojilib')
const emojiData = require('emoji-datasource')
const unicodeEmoji = require('unicode-emoji-json')

const DRY_RUN = process.argv.indexOf('--dry') != -1

const VERSIONS = [1, 2, 3, 4, 5, 11, 12, 12.1, 13, 13.1, 14, 15]
const SKINS = ['1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF']
const SETS = ['native', 'apple', 'facebook', 'google', 'twitter']
const CATEGORIES = [
  ['Smileys & Emotion', 'smileys'],
  ['People & Body', 'people'],
  ['Animals & Nature', 'nature'],
  ['Food & Drink', 'foods'],
  ['Activities', 'activity'],
  ['Travel & Places', 'places'],
  ['Objects', 'objects'],
  ['Symbols', 'symbols'],
  ['Flags', 'flags'],
]

const KEYWORD_SUBSTITUTES = {
  highfive: 'highfive high-five',
}

function unifiedToNative(unified) {
  let unicodes = unified.split('-')
  let codePoints = unicodes.map((u) => `0x${u}`)

  return String.fromCodePoint(...codePoints)
}

function buildData({ set, version } = {}) {
  const categoriesIndex = {}
  const nativeSet = set == 'native'
  const data = {
    categories: [],
    emojis: {},
    aliases: {},
    sheet: { cols: 61, rows: 61 },
  }

  CATEGORIES.forEach((category, i) => {
    let [name, id] = category
    data.categories[i] = { id: id, emojis: [] }
    categoriesIndex[name] = i
  })

  emojiData.sort((a, b) => {
    let aTest = a.sort_order || a.short_name
    let bTest = b.sort_order || b.short_name

    return aTest - bTest
  })

  emojiData.forEach((datum) => {
    if (set && !nativeSet) {
      if (!datum[`has_img_${set}`]) {
        return
      }
    }

    if (!datum.category) {
      throw new Error(`“${datum.short_name}” doesn’t have a category`)
    }

    let unified = datum.unified.toLowerCase()
    let native = unifiedToNative(unified)

    let name = inflection.titleize(
      datum.name || datum.short_name.replace(/\-/g, ' ') || '',
    )

    let unicodeEmojiName = inflection.titleize(unicodeEmoji[native]?.name || '')
    if (
      name.indexOf(':') == -1 &&
      unicodeEmojiName.length &&
      unicodeEmojiName.length < name.length
    ) {
      name = unicodeEmojiName
    }

    if (!name) {
      throw new Error(`“${datum.short_name}” doesn’t have a name`)
    }

    let ids = datum.short_names || []
    if (ids.indexOf(datum.short_name) == -1) {
      ids.unshift(datum.short_name)
    }

    for (let id of ids) {
      if (id == ids[0]) continue
      data.aliases[id] = ids[0]
    }

    let id = ids[0]

    let emoticons = datum.texts || []
    if (datum.text && emoticons.indexOf(datum.text) == -1) {
      emoticons.unshift(datum.text)
    }

    if (id == 'expressionless') {
      if (emoticons.indexOf('-_-') == -1) {
        emoticons.push('-_-')
      }
    }

    let keywords = ids
      .concat(emojiLib[native] || [])
      .map((word) => {
        word = KEYWORD_SUBSTITUTES[word] || word
        return word
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .replace(/(\w)-/, '$1_')
          .split(/[_|\s]+/)
      })
      .flat()
      .filter((word, i, words) => {
        return (
          words.indexOf(word) === i &&
          name.toLowerCase().split(/\s/).indexOf(word) == -1
        )
      })

    let s = { unified, native }
    if (!nativeSet) {
      s.x = datum.sheet_x
      s.y = datum.sheet_y
    }

    let skins = [s]

    if (datum.skin_variations) {
      for (let skin of SKINS) {
        let skinDatum =
          datum.skin_variations[skin] ||
          datum.skin_variations[`${skin}-${skin}`]

        if (!skinDatum || (set && !nativeSet && !skinDatum[`has_img_${set}`])) {
          skins.push(null)
          continue
        }

        let unified = skinDatum.unified.toLowerCase()
        let native = unifiedToNative(skinDatum.unified)
        let s = { unified, native }
        if (!nativeSet) {
          s.x = skinDatum.sheet_x
          s.y = skinDatum.sheet_y
        }

        skins.push(s)
      }
    }

    let addedIn = parseFloat(datum.added_in)
    if (addedIn < 1) addedIn = 1

    if (version && addedIn > version) {
      return
    }

    const emoji = {
      id,
      name,
      emoticons,
      keywords,
      skins,
      version: addedIn,
    }

    if (!emoji.emoticons.length) {
      delete emoji.emoticons
    }

    if (datum.category != 'Component') {
      let categoryIndex = categoriesIndex[datum.category]
      data.categories[categoryIndex].emojis.push(emoji.id)
      data.emojis[emoji.id] = emoji
    }
  })

  let flags = data.categories[categoriesIndex['Flags']]
  flags.emojis = flags.emojis.sort()

  // Merge “Smileys & Emotion” and “People & Body” into a single category
  let smileys = data.categories[0]
  let people = data.categories[1]
  let smileysAndPeople = { id: 'people' }
  smileysAndPeople.emojis = []
    .concat(smileys.emojis.slice(0, 114))
    .concat(people.emojis)
    .concat(smileys.emojis.slice(114))

  data.categories.unshift(smileysAndPeople)
  data.categories.splice(1, 2)

  if (!DRY_RUN) {
    let folder = 'sets'
    if (version) folder += `/${version}`

    mkdir(folder, { recursive: true }, () => {
      writeFile(
        `${folder}/${set || 'all'}.json`,
        JSON.stringify(data),
        (err) => {
          if (err) throw err
        },
      )
    })
  }
}

if (!DRY_RUN) {
  rmSync('sets', { recursive: true })
}

for (let version of VERSIONS) {
  buildData({ version })

  for (let set of SETS) {
    buildData({ set, version })
  }
}
