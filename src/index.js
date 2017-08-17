import emojiIndex from './utils/emoji-index'
import store from './utils/store'
import frequently from './utils/frequently'

export { Picker, Emoji, Category } from './components'
export { emojiIndex, store, frequently }
export { getData,
  getSanitizedData,
  intersect,
  deepMerge,
  unifiedToNative,
  replaceUnicodeString,
  unifiedToEmojiObj,
} from './utils'
