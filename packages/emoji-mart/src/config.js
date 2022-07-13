import i18n_en from '@emoji-mart/data/i18n/en.json'
import { FrequentlyUsed, NativeSupport, SafeFlags } from './helpers'

export let I18n = null
export let Data = null

const DEFAULT_PROPS = {
  autoFocus: {
    value: false,
  },
  emojiButtonColors: {
    value: null,
  },
  emojiButtonRadius: {
    value: '100%',
  },
  emojiButtonSize: {
    value: 36,
  },
  emojiSize: {
    value: 24,
  },
  emojiVersion: {
    value: 14,
    choices: [1, 2, 3, 4, 5, 11, 12, 12.1, 13, 13.1, 14],
  },
  icons: {
    value: 'auto',
    choices: ['auto', 'outline', 'solid'],
  },
  locale: {
    value: 'en',
    choices: [
      'en',
      'de',
      'es',
      'fr',
      'it',
      'ja',
      'nl',
      'pl',
      'pt',
      'ru',
      'uk',
      'zh',
    ],
  },
  maxFrequentRows: {
    value: 4,
  },
  navPosition: {
    value: 'top',
    choices: ['top', 'bottom', 'none'],
  },
  noCountryFlags: {
    value: false,
  },
  noResultsEmoji: {
    value: null,
  },
  perLine: {
    value: 9,
  },
  previewEmoji: {
    value: null,
  },
  previewPosition: {
    value: 'bottom',
    choices: ['top', 'bottom', 'none'],
  },
  searchPosition: {
    value: 'sticky',
    choices: ['sticky', 'static', 'none'],
  },
  set: {
    value: 'native',
    choices: ['native', 'apple', 'facebook', 'google', 'twitter'],
  },
  skin: {
    value: 1,
    choices: [1, 2, 3, 4, 5, 6],
  },
  skinTonePosition: {
    value: 'preview',
    choices: ['preview', 'search', 'none'],
  },
  stickySearch: {
    deprecated: true,
    value: true,
  },
  theme: {
    value: 'auto',
    choices: ['auto', 'light', 'dark'],
  },
}

async function fetchJSON(src) {
  const response = await fetch(src)
  return await response.json()
}

let promise = null
let initiated = false
let initCallback = null
export function init(options) {
  promise ||
    (promise = new Promise((resolve) => {
      initCallback = resolve
    }))

  if (options && !initiated) {
    initiated = true
    _init(options)
  }

  return promise
}

async function _init(props, element) {
  const { data, i18n } = props

  const pickerProps = getProps(props, element)
  const { emojiVersion, set, locale } = pickerProps

  Data =
    (typeof data === 'function' ? await data() : data) ||
    (await fetchJSON(
      `https://cdn.jsdelivr.net/npm/@emoji-mart/data@latest/sets/${emojiVersion}/${set}.json`,
    ))

  I18n =
    (typeof i18n === 'function' ? await i18n() : i18n) ||
    (locale == 'en'
      ? i18n_en
      : await fetchJSON(
          `https://cdn.jsdelivr.net/npm/@emoji-mart/data@latest/i18n/${locale}.json`,
        ))

  if (pickerProps.maxFrequentRows) {
    const emojis = FrequentlyUsed.get(pickerProps)
    if (emojis.length) {
      Data.categories.unshift({
        id: 'frequent',
        emojis: emojis,
      })
    }
  }

  if (props.custom) {
    for (let i in props.custom) {
      i = parseInt(i)
      const category = props.custom[i]
      const prevCategory = props.custom[i - 1]

      if (!category.emojis || !category.emojis.length) continue

      category.id = `custom_${i + 1}`
      category.name || (category.name = I18n.categories.custom)

      if (prevCategory && !category.icon) {
        category.target = prevCategory.target || prevCategory
      }

      Data.categories.push(category)

      const ids = []
      for (const emoji of category.emojis) {
        if (Data.emojis[emoji.id]) {
          continue
        }

        Data.emojis[emoji.id] = emoji
        ids.push(emoji.id)
      }

      category.emojis = ids
    }
  }

  if (props.categories) {
    Data.categories = Data.categories
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
    noCountryFlags =
      pickerProps.noCountryFlags || NativeSupport.noCountryFlags()
  }

  Data.emoticons = {}
  Data.natives = {}
  for (const category of Data.categories) {
    let i = category.emojis.length

    const { categoryIcons } = props
    if (categoryIcons) {
      const icon = categoryIcons[category.id]
      if (icon && !category.icon) {
        category.icon = icon
      }
    }

    while (i--) {
      const emoji = Data.emojis[category.emojis[i]]
      const ignore = () => {
        category.emojis.splice(i, 1)
      }

      if (!emoji) {
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
                return (split ? string.split(/[-|_|\s]+/) : [string]).map((s) =>
                  s.toLowerCase(),
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

        const skinShortcodes = skinIndex == 1 ? '' : `:skin-tone-${skinIndex}:`
        skin.shortcodes = `:${emoji.id}:${skinShortcodes}`
      }
    }
  }

  for (const alias in Data.aliases) {
    const emojiId = Data.aliases[alias]
    const emoji = Data.emojis[emojiId]
    if (!emoji) continue

    emoji.aliases || (emoji.aliases = [])
    emoji.aliases.push(alias)
  }

  initCallback(pickerProps)
}

function getProps(props, element) {
  props || (props = {})

  function get(propName) {
    const defaults = DEFAULT_PROPS[propName]
    let value = (element && element.getAttribute(propName)) || props[propName]

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

    if (
      value == null ||
      (defaults.choices && defaults.choices.indexOf(value) == -1)
    ) {
      value = defaults.value
    }

    return value
  }

  const _props = {}
  for (let k in DEFAULT_PROPS) {
    _props[k] = get(k)
  }

  return _props
}
