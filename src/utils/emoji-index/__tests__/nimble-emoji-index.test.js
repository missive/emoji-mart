import NimbleEmojiIndex from '../nimble-emoji-index.js'
import store from '../../store'

import data from '../../../../data/all'

const nimbleEmojiIndex = new NimbleEmojiIndex(data)

function getEmojiData(skinTone) {
  store.update({ skin: skinTone })

  return nimbleEmojiIndex.search('thumbsup')[0]
}

test('should return emojis with skin tone 1', () => {
  const skinTone = 1
  const emoji = getEmojiData(skinTone)
  expect(emoji.skin).toEqual(skinTone)
})

test('should return emojis with skin tone 6', () => {
  const skinTone = 6
  const emoji = getEmojiData(skinTone)
  expect(emoji.skin).toEqual(skinTone)
})
