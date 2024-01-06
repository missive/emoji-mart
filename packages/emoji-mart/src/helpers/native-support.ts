const CACHE = new Map()
const VERSIONS = [
  { v: 15, emoji: '🫨' },
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
    if (isSupported(emoji)) {
      return v
    }
  }
}

function noCountryFlags() {
  if (isSupported('🇨🇦')) {
    return false
  }

  return true
}

function isSupported(emoji) {
  if (CACHE.has(emoji)) {
    return CACHE.get(emoji)
  }

  const supported = isEmojiSupported(emoji)
  CACHE.set(emoji, supported)

  return supported
}

// https://github.com/koala-interactive/is-emoji-supported
const isEmojiSupported = (() => {
  let ctx = null
  try {
    if (!navigator.userAgent.includes('jsdom')) {
      ctx = document
        .createElement('canvas')
        .getContext('2d', { willReadFrequently: true })
    }
  } catch {}

  // Not in browser env
  if (!ctx) {
    return () => false
  }

  const CANVAS_HEIGHT = 25
  const CANVAS_WIDTH = 20
  const textSize = Math.floor(CANVAS_HEIGHT / 2)

  // Initialize convas context
  ctx.font = textSize + 'px Arial, Sans-Serif'
  ctx.textBaseline = 'top'
  ctx.canvas.width = CANVAS_WIDTH * 2
  ctx.canvas.height = CANVAS_HEIGHT

  return (unicode) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH * 2, CANVAS_HEIGHT)

    // Draw in red on the left
    ctx.fillStyle = '#FF0000'
    ctx.fillText(unicode, 0, 22)

    // Draw in blue on right
    ctx.fillStyle = '#0000FF'
    ctx.fillText(unicode, CANVAS_WIDTH, 22)

    const a = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data
    const count = a.length
    let i = 0

    // Search the first visible pixel
    for (; i < count && !a[i + 3]; i += 4);

    // No visible pixel
    if (i >= count) {
      return false
    }

    // Emoji has immutable color, so we check the color of the emoji in two different colors
    // the result show be the same.
    const x = CANVAS_WIDTH + ((i / 4) % CANVAS_WIDTH)
    const y = Math.floor(i / 4 / CANVAS_WIDTH)
    const b = ctx.getImageData(x, y, 1, 1).data

    if (a[i] !== b[0] || a[i + 2] !== b[2]) {
      return false
    }

    // Some emojis are a contraction of different ones, so if it's not
    // supported, it will show multiple characters
    if (ctx.measureText(unicode).width >= CANVAS_WIDTH) {
      return false
    }

    // Supported
    return true
  }
})()

export default { latestVersion, noCountryFlags }
