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
    var { set, size, onOver, onLeave } = this.props,
        { unified } = this.getData()

    if (!unified) {
      return null
    }

    return <span
      onClick={this.handleClick.bind(this)}
      onMouseEnter={this.handleOver.bind(this)}
      onMouseLeave={this.handleLeave.bind(this)}
      className='emoji-mart-emoji'>
      <span style={{
        width: size,
        height: size,
        display: 'inline-block',
        backgroundImage: `url(https://unpkg.com/emoji-datasource@2.4.4/sheet_${set}_64.png)`,
        backgroundSize: `${100 * SHEET_COLUMNS}%`,
        backgroundPosition: this.getPosition(),
      }}>
      </span>
    </span>
  }
}

Emoji.propTypes = {
  skin: React.PropTypes.number,
  set: React.PropTypes.string,
  onOver: React.PropTypes.func,
  onLeave: React.PropTypes.func,
  onClick: React.PropTypes.func,
  size: React.PropTypes.number.isRequired,
  emoji: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
  ]).isRequired,
}

Emoji.defaultProps = {
  skin: 1,
  set: 'apple',
  onOver: (() => {}),
  onLeave: (() => {}),
  onClick: (() => {}),
}
