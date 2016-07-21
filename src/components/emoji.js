import React from 'react'
import data from '../../data'

import {getData, getSanitizedData} from '../utils'

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
      nextProps.sheetURL != this.props.sheetURL
    )
  }

  getPosition() {
    var { sheet_x, sheet_y } = this.getData(),
        multiply = 100 / (SHEET_COLUMNS - 1)

    return `${multiply * sheet_x}% ${multiply * sheet_y}%`
  }

  getData() {
    var { emoji, skin, sheetURL } = this.props
    return getData(emoji, skin, sheetURL)
  }

  getSanitizedData() {
    var { emoji, skin, sheetURL } = this.props
    return getSanitizedData(emoji, skin, sheetURL)
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
    var { sheetURL, size, onOver, onLeave } = this.props

    return <span
      onClick={this.handleClick.bind(this)}
      onMouseEnter={this.handleOver.bind(this)}
      onMouseLeave={this.handleLeave.bind(this)}
      className='emoji-picker-emoji'>
      <span style={{
        width: size,
        height: size,
        display: 'inline-block',
        backgroundImage: `url(${sheetURL})`,
        backgroundSize: `${100 * SHEET_COLUMNS}%`,
        backgroundPosition: this.getPosition(),
      }}>
      </span>
    </span>
  }
}

Emoji.propTypes = {
  skin: React.PropTypes.number,
  onOver: React.PropTypes.func,
  onLeave: React.PropTypes.func,
  onClick: React.PropTypes.func,
  size: React.PropTypes.number.isRequired,
  sheetURL: React.PropTypes.string.isRequired,
  emoji: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
  ]).isRequired,
}

Emoji.defaultProps = {
  skin: 1,
  onOver: (() => {}),
  onLeave: (() => {}),
  onClick: (() => {}),
}
