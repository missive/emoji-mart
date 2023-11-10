import { Data } from '../../config'
import { SearchIndex } from '../../helpers'

export default function Emoji(props) {
  let {
    id,
    skin,
    emoji,
    imageURL,
    spritesheetURL,
    fallbackImageURL,
    fallbackSpritesheetURL,
  } = props

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

  const imageSrc =
    emojiSkin.src ||
    (props.set != 'native' && !props.spritesheet
      ? imageURL !== null
        ? imageURL.replace('emojiskin-unified', emojiSkin.unified)
        : fallbackImageURL.replace('emojiskin-unified', emojiSkin.unified)
      : undefined)

  const spritesheetSrc =
    spritesheetURL !== null ? spritesheetURL : fallbackSpritesheetURL

  return (
    <span class="emoji-mart-emoji" data-emoji-set={props.set}>
      {imageSrc ? (
        <img
          style={{
            maxWidth: props.size || '1em',
            maxHeight: props.size || '1em',
            display: 'inline-block',
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
