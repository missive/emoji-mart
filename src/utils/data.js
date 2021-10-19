const { remove: removeDiacritics } = require('diacritics')

const mapping = {
  name: 'a',
  unified: 'b',
  non_qualified: 'c',
  has_img_apple: 'd',
  has_img_google: 'e',
  has_img_twitter: 'f',
  has_img_facebook: 'h',
  keywords: 'j',
  sheet: 'k',
  emoticons: 'l',
  text: 'm',
  short_names: 'n',
  added_in: 'o',
}

const applyI18nToEmoji = (emoji, id, i18n) => {
  if (i18n && i18n.emojis) {
    const i18nProps = i18n.emojis[id]
    if (i18nProps) {
      for (let key in i18nProps) {
        emoji[key] = i18nProps[key]
      }
    }
  }
}

const buildSearch = (emoji) => {
  const search = []

  var addToSearch = (strings, split) => {
    if (!strings) {
      return
    }

    ;(Array.isArray(strings) ? strings : [strings]).forEach((string) => {
      ;(split ? string.split(/[-|_|\s]+/) : [string]).forEach((s) => {
        s = s.toLowerCase()

        if (search.indexOf(s) == -1) {
          search.push(s)
        }
      })
    })
  }

  addToSearch(emoji.short_names, true)
  addToSearch(emoji.name, true)
  addToSearch(emoji.keywords, false)
  addToSearch(emoji.emoticons, false)

  const withoutDiacritics = search.map((s) => removeDiacritics(s))

  return search.concat(withoutDiacritics).join(',')
}

const compress = (emoji) => {
  emoji.short_names = emoji.short_names.filter((short_name) => {
    return short_name !== emoji.short_name
  })
  delete emoji.short_name

  emoji.sheet = [emoji.sheet_x, emoji.sheet_y]
  delete emoji.sheet_x
  delete emoji.sheet_y

  emoji.added_in = parseInt(emoji.added_in)
  if (emoji.added_in === 6) {
    delete emoji.added_in
  }

  for (let key in mapping) {
    emoji[mapping[key]] = emoji[key]
    delete emoji[key]
  }

  for (let key in emoji) {
    let value = emoji[key]

    if (Array.isArray(value) && !value.length) {
      delete emoji[key]
    } else if (typeof value === 'string' && !value.length) {
      delete emoji[key]
    } else if (value === null) {
      delete emoji[key]
    }
  }
}

const uncompress = (data, i18n) => {
  data.compressed = false

  for (let id in data.emojis) {
    let emoji = data.emojis[id]

    for (let key in mapping) {
      emoji[key] = emoji[mapping[key]]
      delete emoji[mapping[key]]
    }

    applyI18nToEmoji(emoji, id, i18n)

    if (!emoji.short_names) emoji.short_names = []
    emoji.short_names.unshift(id)

    emoji.sheet_x = emoji.sheet[0]
    emoji.sheet_y = emoji.sheet[1]
    delete emoji.sheet

    if (!emoji.text) emoji.text = ''

    if (!emoji.added_in) emoji.added_in = 6
    emoji.added_in = emoji.added_in.toFixed(1)

    emoji.search = buildSearch(emoji)
  }
}

const mergeI18nToEmojis = (data, i18n) => {
  for (let id in data.emojis) {
    const emoji = data.emojis[id]
    applyI18nToEmoji(emoji, id, i18n)
    emoji.search = buildSearch(emoji)
  }
}

export { buildSearch, compress, uncompress, mergeI18nToEmojis }
