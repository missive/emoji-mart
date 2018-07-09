import React from 'react'
import PropTypes from 'prop-types'

import { getData, getSanitizedData, unifiedToNative } from '../../utils'
import { uncompress } from '../../utils/data'
import { EmojiPropTypes, EmojiDefaultProps } from '../../utils/shared-props'

const SHEET_COLUMNS = 52

const _getData = (props) => {
  var { emoji, skin, set, data } = props
  return getData(emoji, skin, set, data)
}

const _getPosition = (props) => {
  var { sheet_x, sheet_y } = _getData(props),
    multiply = 100 / (SHEET_COLUMNS - 1)

  return `${multiply * sheet_x}% ${multiply * sheet_y}%`
}

const _getSanitizedData = (props) => {
  var { emoji, skin, set, data } = props
  return getSanitizedData(emoji, skin, set, data)
}

const _handleClick = (e, props) => {
  if (!props.onClick) {
    return
  }
  var { onClick } = props,
    emoji = _getSanitizedData(props)

  onClick(emoji, e)
}

const _handleOver = (e, props) => {
  if (!props.onOver) {
    return
  }
  var { onOver } = props,
    emoji = _getSanitizedData(props)

  onOver(emoji, e)
}

const _handleLeave = (e, props) => {
  if (!props.onLeave) {
    return
  }
  var { onLeave } = props,
    emoji = _getSanitizedData(props)

  onLeave(emoji, e)
}

const _isNumeric = (value) => {
  return !isNaN(value - parseFloat(value))
}

const _convertStyleToCSS = (style) => {
  let div = document.createElement('div')

  for (let key in style) {
    let value = style[key]

    if (_isNumeric(value)) {
      value += 'px'
    }

    div.style[key] = value
  }

  return div.getAttribute('style')
}

const _getFallback = (props, data) => {
  if (props.fallback) {
    return props.fallback(data)
  }

  return null
}

const NimbleEmoji = (props) => {
  if (props.data.compressed) {
    uncompress(props.data)
  }

  for (let k in NimbleEmoji.defaultProps) {
    if (props[k] == undefined && NimbleEmoji.defaultProps[k] != undefined) {
      props[k] = NimbleEmoji.defaultProps[k]
    }
  }

  let data = _getData(props)
  if (!data) {
    return _getFallback(props, data)
  }

  let { unified, custom, short_names, imageUrl } = data,
    style = {},
    children = props.children,
    className = 'emoji-mart-emoji',
    title = null

  if (!unified && !custom) {
    return _getFallback(props, data)
  }

  if (props.tooltip) {
    title = short_names[0]
  }

  if (props.native && unified) {
    className += ' emoji-mart-emoji-native'
    style = { fontSize: props.size }
    children = unifiedToNative(unified)

    if (props.forceSize) {
      style.display = 'inline-block'
      style.width = props.size
      style.height = props.size
    }
  } else if (custom) {
    className += ' emoji-mart-emoji-custom'
    style = {
      width: props.size,
      height: props.size,
      display: 'inline-block',
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'contain',
    }
  } else {
    let setHasEmoji =
      data[`has_img_${props.set}`] == undefined || data[`has_img_${props.set}`]

    if (!setHasEmoji) {
      return _getFallback(props, data)
    } else {
      style = {
        width: props.size,
        height: props.size,
        display: 'inline-block',
        backgroundImage: `url(${props.backgroundImageFn(
          props.set,
          props.sheetSize,
        )})`,
        backgroundSize: `${100 * SHEET_COLUMNS}%`,
        backgroundPosition: _getPosition(props),
      }
    }
  }

  // Since we are re-using the background logic for image tag
  // let's use this 1x1 pixel transparent image to avoid showing a broken image
  const transparentImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8='

  if (props.html) {
    style = _convertStyleToCSS(style)
    const title = title ? `title=${title}` : ''

    if (props.renderAsImage) {
      return `
        <span class='${className}' ${title}>
          <img
            src='${transparentImage}'
            style='${style}' 
            alt='${props.emoji.id || props.emoji}'
          />
          ${children || ''}
        </span>`
    }

    return `
    <span style='${style}' ${title} class='${className}'>
      ${children || ''}
    </span>`
  }

  if (props.renderAsImage) {
    return (
      <span
        key={props.emoji.id || props.emoji}
        onClick={(e) => _handleClick(e, props)}
        onMouseEnter={(e) => _handleOver(e, props)}
        onMouseLeave={(e) => _handleLeave(e, props)}
        title={title}
        className={className}
      >
        <img
          alt={props.emoji.id || props.emoji}
          src={transparentImage}
          style={style}
        />
        {children}
      </span>
    )
  }

  return (
    <span
      key={props.emoji.id || props.emoji}
      onClick={(e) => _handleClick(e, props)}
      onMouseEnter={(e) => _handleOver(e, props)}
      onMouseLeave={(e) => _handleLeave(e, props)}
      title={title}
      className={className}
    >
      <span style={style}>{children}</span>
    </span>
  )
}

NimbleEmoji.propTypes = { ...EmojiPropTypes, data: PropTypes.object.isRequired }
NimbleEmoji.defaultProps = EmojiDefaultProps

export default NimbleEmoji
