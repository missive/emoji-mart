import React from 'react'
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
      nextProps.set != this.props.set
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
    var { onClick } = this.props,
        emoji = this.getSanitizedData()

    onClick(emoji, e)
  }

  handleOver(e) {
    var { onOver } = this.props,
        emoji = this.getSanitizedData()

    onOver(emoji, e)
  }

  handleLeave(e) {
    var { onLeave } = this.props,
        emoji = this.getSanitizedData()

    onLeave(emoji, e)
  }

  render() {
    var { set, size, sheetSize, native, onOver, onLeave, backgroundImageFn } = this.props,
        { unified } = this.getData(),
        style = {},
        children = null

    if (!unified) {
      return null
    }

    if (native && unified) {
      style = { fontSize: size }
      children = unifiedToNative(unified)
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
  onOver: React.PropTypes.func,
  onLeave: React.PropTypes.func,
  onClick: React.PropTypes.func,
  backgroundImageFn: React.PropTypes.func,
  native: React.PropTypes.bool,
  skin: React.PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  sheetSize: React.PropTypes.oneOf([16, 20, 32, 64]),
  set: React.PropTypes.oneOf(['apple', 'google', 'twitter', 'emojione']),
  size: React.PropTypes.number.isRequired,
  emoji: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
  ]).isRequired,
}

Emoji.defaultProps = {
  skin: 1,
  set: 'apple',
  sheetSize: 64,
  native: false,
  onOver: (() => {}),
  backgroundImageFn: ((set, sheetSize) => `https://unpkg.com/emoji-datasource@2.4.4/sheet_${set}_${sheetSize}.png`),
  onLeave: (() => {}),
  onClick: (() => {}),
}
