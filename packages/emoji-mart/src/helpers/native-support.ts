import { isEmojiSupported } from 'is-emoji-supported'

const VERSIONS = [
  { v: 14, emoji: '🫠' },
  { v: 13.1, emoji: '😶‍🌫️' },
  { v: 13, emoji: '🥸' },
  { v: 12.1, emoji: '🧑‍🦰' },
  { v: 12, emoji: '🥱' },
  { v: 11, emoji: '🥰' },
  { v: 5, emoji: '🤩' },
  { v: 4, emoji: '👱‍♀️' },
  { v: 3, emoji: '🤣' },
  { v: 2, emoji: '👋🏻' },
  { v: 1, emoji: '🙃' },
]

function latestVersion() {
  for (const { v, emoji } of VERSIONS) {
    if (isEmojiSupported(emoji)) {
      return v
    }
  }
}

function noCountryFlags() {
  if (isEmojiSupported('🇨🇦')) {
    return false
  }

  return true
}

export default { latestVersion, noCountryFlags }