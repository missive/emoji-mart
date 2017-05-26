import React from 'react'
import PropTypes from 'prop-types'
import data from '../../data'

import { getData, getSanitizedData, unifiedToNative } from '../utils'

const SHEET_COLUMNS = 41

export default class Emoji extends React.Component {
  constructor(props) {
    super(props)

    this.hasSkinVariations = !!this.getData().skin_variations
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.hasSkinVariations && nextProps.skin != this.props.skin ||
      nextProps.size != this.props.size ||
      nextProps.native != this.props.native ||
      nextProps.set != this.props.set ||
      nextProps.emoji != this.props.emoji
    )
  }

  getPosition() {
    var { sheet_x, sheet_y } = this.getData(),
        multiply = 100 / (SHEET_COLUMNS - 1)

    return `${multiply * sheet_x}% ${multiply * sheet_y}%`
  }

  getData() {
    var { emoji, skin, set } = this.props
    return getData(emoji, skin, set)
  }

  getSanitizedData() {
    var { emoji, skin, set } = this.props
    return getSanitizedData(emoji, skin, set)
  }

  handleClick(e) {
    if (!this.props.onClick) { return }
    var { onClick } = this.props,
        emoji = this.getSanitizedData()

    onClick(emoji, e)
  }

  handleOver(e) {
    if (!this.props.onOver) { return }
    var { onOver } = this.props,
        emoji = this.getSanitizedData()

    onOver(emoji, e)
  }

  handleLeave(e) {
    if (!this.props.onLeave) { return }
    var { onLeave } = this.props,
        emoji = this.getSanitizedData()

    onLeave(emoji, e)
  }

  render() {
    var { set, size, sheetSize, native, forceSize, onOver, onLeave, backgroundImageFn } = this.props,
        { unified, custom, imageUrl } = this.getData(),
        style = {},
        children = this.props.children

    if (!unified && !custom) {
      return null
    }

    if (native && unified) {
      style = { fontSize: size }
      children = unifiedToNative(unified)

      if (forceSize) {
        style.display = 'inline-block'
        style.width = size
        style.height = size
      }
    } else if (custom) {
      style = {
        width: size,
        height: size,
        display: 'inline-block',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: '100%'
      }
    } else {
      style = {
        width: size,
        height: size,
        display: 'inline-block',
        backgroundImage: `url(${backgroundImageFn(set, sheetSize)})`,
        backgroundSize: `${100 * SHEET_COLUMNS}%`,
        backgroundPosition: this.getPosition(),
      }
    }

    return <span
      onClick={this.handleClick.bind(this)}
      onMouseEnter={this.handleOver.bind(this)}
      onMouseLeave={this.handleLeave.bind(this)}
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
  set: PropTypes.oneOf(['apple', 'google', 'twitter', 'emojione']),
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
  backgroundImageFn: ((set, sheetSize) => `https://unpkg.com/emoji-datasource@${EMOJI_DATASOURCE_VERSION}/sheet_${set}_${sheetSize}.png`),
  onOver: (() => {}),
  onLeave: (() => {}),
  onClick: (() => {}),
}
