import { Data } from '../../config'
import { SearchIndex } from '../../helpers'

const getImageSrc = (props, emojiSkin) => {
  if (emojiSkin.src) {
    return emojiSkin.src;
  }

  if (props.set === 'native' || props.spritesheet) {
    return undefined
  }

  if (typeof props.getImageURL === 'function') {
    return props.getImageURL(props.set, emojiSkin.unified)
  }

  if (typeof props.imageURL === 'string') {
    return props.imageURL
  }

  return `https://cdn.jsdelivr.net/npm/emoji-datasource-${props.set}@14.0.0/img/${props.set}/64/${emojiSkin.unified}.png`
}

const getSpritesheetSrc = (props) => {
  if (typeof props.getSpritesheetURL === 'function') {
    return props.getSpritesheetURL(props.set)
  }

  if (typeof props.spritesheetURL === 'string') {
    return props.spritesheetURL
  }

  return `https://cdn.jsdelivr.net/npm/emoji-datasource-${props.set}@14.0.0/img/${props.set}/sheets-256/64.png`
}

export default function Emoji(props) {
  let { id, skin, emoji } = props

  if (props.shortcodes) {
    const matches = props.shortcodes.match(SearchIndex.SHORTCODES_REGEX)

    if (matches) {
      id = matches[1]

      if (matches[2]) {
        skin = matches[2]
      }
    }
  }

  emoji || (emoji = SearchIndex.get(id || props.native))
  if (!emoji) return props.fallback

  const emojiSkin = emoji.skins[skin - 1] || emoji.skins[0]

  const imageSrc = getImageSrc(props, emojiSkin)
  const spritesheetSrc = getSpritesheetSrc(props)

  return (
    <span class="emoji-mart-emoji" data-emoji-set={props.set}>
      {imageSrc ? (
        <img
          style={{
            height: props.size || '1em',
            width: 'auto',
            display: 'inline-block',
            position: 'relative',
            top: '.1em',
          }}
          alt={emojiSkin.native || emojiSkin.shortcodes}
          src={imageSrc}
        />
      ) : props.set == 'native' ? (
        <span
          style={{
            fontSize: props.size,
            fontFamily:
              '"EmojiMart", "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji", "Android Emoji"',
          }}
        >
          {emojiSkin.native}
        </span>
      ) : (
        <span
          style={{
            display: 'block',
            width: props.size,
            height: props.size,
            backgroundImage: `url(${spritesheetSrc})`,
            backgroundSize: `${100 * Data.sheet.cols}% ${
              100 * Data.sheet.rows
            }%`,
            backgroundPosition: `${
              (100 / (Data.sheet.cols - 1)) * emojiSkin.x
            }% ${(100 / (Data.sheet.rows - 1)) * emojiSkin.y}%`,
          }}
        ></span>
      )}
    </span>
  )
}
