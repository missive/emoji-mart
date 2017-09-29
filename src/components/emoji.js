import React from 'react'
import PropTypes from 'prop-types'
import data from '../../data'

import { getData, getSanitizedData, unifiedToNative } from '../utils'

const SHEET_COLUMNS = 49

const _getPosition = (props) => {
  var { sheet_x, sheet_y } = _getData(props),
      multiply = 100 / (SHEET_COLUMNS - 1)

  return `${multiply * sheet_x}% ${multiply * sheet_y}%`
}

const _getData = (props) => {
  var { emoji, skin, set } = props
  return getData(emoji, skin, set)
}

const _getSanitizedData = (props) => {
  var { emoji, skin, set } = props
  return getSanitizedData(emoji, skin, set)
}

export default class Emoji extends React.PureComponent {

  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleEnter = this.handleEnter.bind(this)
    this.handleLeave = this.handleLeave.bind(this)
  }

  handleClick (e) {
    if (!this.props.onClick) { return }

    const { onClick } = this.props,
        emoji = _getSanitizedData(this.props)

    onClick(emoji, e)
  }

  handleEnter (e) {
    if (!this.props.onOver) { return }

    const { onOver } = this.props,
        emoji = _getSanitizedData(this.props)

    onOver(emoji, e)
  }

  handleLeave (e) {
    if (!this.props.onLeave) { return }

    const { onLeave } = this.props,
        emoji = _getSanitizedData(this.props)

    onLeave(emoji, e)
  }

  render () {
    var props = this.props;

    var { unified, custom, imageUrl } = _getData(props),
        style = {},
        children = props.children

    if (!unified && !custom) {
      return null
    }

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
      let setHasEmoji = _getData(props)[`has_img_${props.set}`]

      if (!setHasEmoji) {
        return null
      }

      style = {
        width: props.size,
        height: props.size,
        display: 'inline-block',
        backgroundImage: `url(${props.backgroundImageFn(props.set, props.sheetSize)})`,
        backgroundSize: `${100 * SHEET_COLUMNS}%`,
        backgroundPosition: _getPosition(props),
      }
    }

    return <span
      key={props.emoji.id || props.emoji}
      onClick={this.handleClick}
      onMouseEnter={this.handleEnter}
      onMouseLeave={this.handleLeave}
      className='emoji-mart-emoji'>
      <span style={style}>{children}</span>
    </span>
  }

}

Emoji.propTypes = {
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
  skin: 1,
  set: 'apple',
  sheetSize: 64,
  native: false,
  forceSize: false,
  backgroundImageFn: ((set, sheetSize) => `https://unpkg.com/emoji-datasource-${set}@${EMOJI_DATASOURCE_VERSION}/img/${set}/sheets/${sheetSize}.png`),
  onOver: (() => {}),
  onLeave: (() => {}),
  onClick: (() => {}),
}
