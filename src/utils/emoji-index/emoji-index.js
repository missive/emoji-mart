import data from '../../../data/all.json'
import NimbleEmojiIndex from './nimble-emoji-index'

const emojiIndex = new NimbleEmojiIndex(data)
const { emojis, emoticons } = emojiIndex

function search() {
  return emojiIndex.search(...arguments)
}

export default { search, emojis, emoticons }
