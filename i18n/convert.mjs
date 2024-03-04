import fs from 'node:fs'

// ️Variation Selector-16
const VS16 = '\ufe0f'
// Zero Width Joiner
const ZWJ = '\u200D'
// Remove VS16 and ZWJ from emoji to compare CLDR / emoji-mart data
const strippedEmoji = (emoji) => emoji.replaceAll(VS16, '').replaceAll(ZWJ, '')

// Read emoji-mart data
let data = JSON.parse(fs.readFileSync('data.json', 'utf-8'))

// Read CLDR data
let deFull = JSON.parse(fs.readFileSync('cldr/de-full.json', 'utf-8'))
let deDerived = JSON.parse(fs.readFileSync('cldr/de-derived.json', 'utf-8'))

// Combine data
for (let emojiId in data.emojis) {
  let emojiData = data.emojis[emojiId]
  let emoji = strippedEmoji(emojiData.skins[0].native)

  const deFullEmoji = Object.keys(deFull.annotations.annotations).find(
    (deFullEmoji) => emoji === strippedEmoji(deFullEmoji),
  )
  if (deFullEmoji) {
    emojiData.name = deFull.annotations.annotations[deFullEmoji].tts[0]
    emojiData.keywords = deFull.annotations.annotations[deFullEmoji].default
  }

  const deDerivedEmoji = Object.keys(
    deDerived.annotationsDerived.annotations,
  ).find((deDerivedEmoji) => emoji === strippedEmoji(deDerivedEmoji))
  if (deDerivedEmoji) {
    emojiData.name =
      deDerived.annotationsDerived.annotations[deDerivedEmoji].tts[0]
    emojiData.keywords =
      deDerived.annotationsDerived.annotations[deDerivedEmoji].default
  }
}

// Write localized data
fs.writeFileSync('data-de.json', JSON.stringify(data))
