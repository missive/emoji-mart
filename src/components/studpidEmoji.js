import React from 'react'
import PropTypes from 'prop-types'

import {sanitize, unifiedToNative} from '../utils/clear.js'

const SHEET_COLUMNS = 49

const _getPosition = (props) => {
  var { sheet_x, sheet_y } = props,
      multiply = 100 / (SHEET_COLUMNS - 1)

  return `${multiply * sheet_x}% ${multiply * sheet_y}%`
}

const _getSanitizedData = (props) => {
  return sanitize(props.emojiData)
}

const _handleClick = (e, props) => {
  if (!props.onClick) { return }
  var { onClick } = props,
      emoji = _getSanitizedData(props)

  onClick(emoji, e)
}

const _handleOver = (e, props) => {
  if (!props.onOver) { return }
  var { onOver } = props,
      emoji = _getSanitizedData(props)

  onOver(emoji, e)
}

const _handleLeave = (e, props) => {
  if (!props.onLeave) { return }
  var { onLeave } = props,
      emoji = _getSanitizedData(props)

  onLeave(emoji, e)
}

const Emoji = (props) => {
  for (let k in Emoji.defaultProps) {
    if (props[k] == undefined && Emoji.defaultProps[k] != undefined) {
      props[k] = Emoji.defaultProps[k]
    }
  }

  var { unified, custom, imageUrl } = props.emojiData,
      style = {},
      children = props.children

  if (props.native && unified) {
    style = { fontSize: props.size }
    children = unifiedToNative(unified)

    if (props.forceSize) {
      style.display = 'inline-block'
      style.width = props.size
      style.height = props.size
    }
  } else if (custom) {
    style = {
      width: props.size,
      height: props.size,
      display: 'inline-block',
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: '100%',
    }
  } else {
    let setHasEmoji = props.emojiData[`has_img_${props.set}`]
    if (!setHasEmoji) {
      return null
    }

    style = {
      width: props.size,
      height: props.size,
      display: 'inline-block',
      backgroundImage: `url(${props.backgroundImageFn(props.set, props.sheetSize)})`,
      backgroundSize: `${100 * SHEET_COLUMNS}%`,
      backgroundPosition: _getPosition(props.emojiData),
    }
  }

  return <span
    key={props.id}
    onClick={(e) => _handleClick(e, props)}
    onMouseEnter={(e) => _handleOver(e, props)}
    onMouseLeave={(e) => _handleLeave(e, props)}
    className='emoji-mart-emoji'>
    <span style={style}>{children}</span>
  </span>
}

Emoji.propTypes = {
  emojiData: PropTypes.object,
  onOver: PropTypes.func,
  onLeave: PropTypes.func,
  onClick: PropTypes.func,
  backgroundImageFn: PropTypes.func,
  native: PropTypes.bool,
  forceSize: PropTypes.bool,
  skin: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  sheetSize: PropTypes.oneOf([16, 20, 32, 64]),
  set: PropTypes.oneOf(['apple', 'google', 'twitter', 'emojione', 'messenger', 'facebook']),
  size: PropTypes.number.isRequired,
  emoji: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
}

Emoji.defaultProps = {
  emojiData: {
    "name": "UPSIDE-DOWN FACE",
    "unified": "1F643",
    "variations": [

    ],
    "docomo": null,
    "au": null,
    "softbank": null,
    "google": null,
    "image": "1f643.png",
    "sheet_x": 24,
    "sheet_y": 2,
    "short_name": "upside_down_face",
    "short_names": [
        "upside_down_face"
    ],
    "text": null,
    "texts": null,
    "category": "People",
    "sort_order": 13,
    "added_in": "8.0",
    "has_img_apple": true,
    "has_img_google": true,
    "has_img_twitter": true,
    "has_img_emojione": true,
    "has_img_facebook": true,
    "has_img_messenger": false
  },
  skin: 1,
  set: 'apple',
  sheetSize: 64,
  size: 64,
  native: false,
  forceSize: false,
  onOver: (() => {}),
  onLeave: (() => {}),
  onClick: (() => {}),
  backgroundImageFn: ((set, sheetSize) => `https://unpkg.com/emoji-datasource-${set}@${EMOJI_DATASOURCE_VERSION}/img/${set}/sheets/${sheetSize}.png`)
}

export default Emoji
