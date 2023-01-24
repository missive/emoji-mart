// @ts-nocheck
import i18n_en from '@emoji-mart/data/i18n/en.json'
import PickerProps from './components/Picker/PickerProps'
import {
  FrequentlyUsed,
  NativeSupport,
  SafeFlags,
  SearchIndex,
} from './helpers'

export let I18n = null
export let Data = null

const fetchCache = {}
async function fetchJSON(src) {
  if (fetchCache[src]) {
    return fetchCache[src]
  }

  const response = await fetch(src)
  const json = await response.json()

  fetchCache[src] = json
  return json
}

let promise: Promise<void> | null = null
let initiated = false
let initCallback = null
let initialized = false

export function init(options, { caller } = {}) {
  promise ||
    (promise = new Promise((resolve) => {
      initCallback = resolve
    }))

  if (options) {
    _init(options)
  } else if (caller && !initialized) {
    console.warn(
      `\`${caller}\` requires data to be initialized first. Promise will be pending until \`init\` is called.`,
    )
  }

  return promise
}

async function _init(props) {
  initialized = true

  let { emojiVersion, set, locale } = props
  emojiVersion || (emojiVersion = PickerProps.emojiVersion.value)
  set || (set = PickerProps.set.value)
  locale || (locale = PickerProps.locale.value)

  if (!Data) {
    Data =
      (typeof props.data === 'function' ? await props.data() : props.data) ||
      (await fetchJSON(
        `https://cdn.jsdelivr.net/npm/@emoji-mart/data@latest/sets/${emojiVersion}/${set}.json`,
      ))

    Data.emoticons = {}
    Data.natives = {}

    Data.categories.unshift({
      id: 'frequent',
      emojis: [],
    })

    for (const alias in Data.aliases) {
      const emojiId = Data.aliases[alias]
      const emoji = Data.emojis[emojiId]
      if (!emoji) continue

      emoji.aliases || (emoji.aliases = [])
      emoji.aliases.push(alias)
    }

    Data.originalCategories = Data.categories
  } else {
    Data.categories = Data.categories.filter((c) => {
      const isCustom = !!c.name
      if (!isCustom) return true

      return false
    })
  }

  I18n =
    (typeof props.i18n === 'function' ? await props.i18n() : props.i18n) ||
    (locale == 'en'
      ? i18n_en
      : await fetchJSON(
          `https://cdn.jsdelivr.net/npm/@emoji-mart/data@latest/i18n/${locale}.json`,
        ))

  if (props.custom) {
    for (let i in props.custom) {
      i = parseInt(i)
      const category = props.custom[i]
      const prevCategory = props.custom[i - 1]

      if (!category.emojis || !category.emojis.length) continue

      category.id || (category.id = `custom_${i + 1}`)
      category.name || (category.name = I18n.categories.custom)

      if (prevCategory && !category.icon) {
        category.target = prevCategory.target || prevCategory
      }

      Data.categories.push(category)

      for (const emoji of category.emojis) {
        Data.emojis[emoji.id] = emoji
      }
    }
  }

  if (props.categories) {
    Data.categories = Data.originalCategories
      .filter((c) => {
        return props.categories.indexOf(c.id) != -1
      })
      .sort((c1, c2) => {
        const i1 = props.categories.indexOf(c1.id)
        const i2 = props.categories.indexOf(c2.id)

        return i1 - i2
      })
  }

  let latestVersionSupport = null
  let noCountryFlags = null
  if (set == 'native') {
    latestVersionSupport = NativeSupport.latestVersion()
    noCountryFlags = props.noCountryFlags || NativeSupport.noCountryFlags()
  }

  let categoryIndex = Data.categories.length
  let resetSearchIndex = false
  while (categoryIndex--) {
    const category = Data.categories[categoryIndex]

    if (category.id == 'frequent') {
      let { maxFrequentRows, perLine } = props

      maxFrequentRows =
        maxFrequentRows >= 0
          ? maxFrequentRows
          : PickerProps.maxFrequentRows.value
      perLine || (perLine = PickerProps.perLine.value)

      category.emojis = FrequentlyUsed.get({ maxFrequentRows, perLine })
    }

    if (!category.emojis || !category.emojis.length) {
      Data.categories.splice(categoryIndex, 1)
      continue
    }

    const { categoryIcons } = props
    if (categoryIcons) {
      const icon = categoryIcons[category.id]
      if (icon && !category.icon) {
        category.icon = icon
      }
    }

    let emojiIndex = category.emojis.length
    while (emojiIndex--) {
      const emojiId = category.emojis[emojiIndex]
      const emoji = emojiId.id ? emojiId : Data.emojis[emojiId]

      const ignore = () => {
        category.emojis.splice(emojiIndex, 1)
      }

      if (
        !emoji ||
        (props.exceptEmojis && props.exceptEmojis.includes(emoji.id))
      ) {
        ignore()
        continue
      }

      if (latestVersionSupport && emoji.version > latestVersionSupport) {
        ignore()
        continue
      }

      if (noCountryFlags && category.id == 'flags') {
        if (!SafeFlags.includes(emoji.id)) {
          ignore()
          continue
        }
      }

      if (!emoji.search) {
        resetSearchIndex = true
        emoji.search =
          ',' +
          [
            [emoji.id, false],
            [emoji.name, true],
            [emoji.keywords, false],
            [emoji.emoticons, false],
          ]
            .map(([strings, split]) => {
              if (!strings) return
              return (Array.isArray(strings) ? strings : [strings])
                .map((string) => {
                  return (split ? string.split(/[-|_|\s]+/) : [string]).map(
                    (s) => s.toLowerCase(),
                  )
                })
                .flat()
            })
            .flat()
            .filter((a) => a && a.trim())
            .join(',')

        if (emoji.emoticons) {
          for (const emoticon of emoji.emoticons) {
            if (Data.emoticons[emoticon]) continue
            Data.emoticons[emoticon] = emoji.id
          }
        }

        let skinIndex = 0
        for (const skin of emoji.skins) {
          if (!skin) continue
          skinIndex++

          const { native } = skin
          if (native) {
            Data.natives[native] = emoji.id
            emoji.search += `,${native}`
          }

          const skinShortcodes =
            skinIndex == 1 ? '' : `:skin-tone-${skinIndex}:`
          skin.shortcodes = `:${emoji.id}:${skinShortcodes}`
        }
      }
    }
  }

  if (resetSearchIndex) {
    SearchIndex.reset()
  }

  initCallback()
}

export function getProps(props, defaultProps, element) {
  props || (props = {})

  const _props = {}
  for (let k in defaultProps) {
    _props[k] = getProp(k, props, defaultProps, element)
  }

  return _props
}

export function getProp(propName, props, defaultProps, element) {
  const defaults = defaultProps[propName]
  let value =
    (element && element.getAttribute(propName)) ||
    (props[propName] != null && props[propName] != undefined
      ? props[propName]
      : null)

  if (!defaults) {
    return value
  }

  if (
    value != null &&
    defaults.value &&
    typeof defaults.value != typeof value
  ) {
    if (typeof defaults.value == 'boolean') {
      value = value == 'false' ? false : true
    } else {
      value = defaults.value.constructor(value)
    }
  }

  if (defaults.transform && value) {
    value = defaults.transform(value)
  }

  if (
    value == null ||
    (defaults.choices && defaults.choices.indexOf(value) == -1)
  ) {
    value = defaults.value
  }

  return value
}
