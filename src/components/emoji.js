import React from 'react'
import data from '../../data'

const SHEET_SIZE = 2624
const EMOJI_SIZE = 64

export default class Emoji extends React.Component {
  componentWillMount() {
    this.emoji = data.emojis[this.props.emoji]
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.size != this.props.size ||
      nextProps.sheetURL != this.props.sheetURL
    )
  }

  getSheetSize() {
    var { size } = this.props,
        sheetSize = SHEET_SIZE * size / EMOJI_SIZE

    return `${sheetSize}px ${sheetSize}px`
  }

  getEmojiPosition(emoji) {
    var { size } = this.props,
        { sheet_x, sheet_y } = emoji,
        x = sheet_x * size,
        y = sheet_y * size

    return `-${x}px -${y}px`
  }

  render() {
    var { sheetURL, size, onOver, onLeave, onClick } = this.props

    return <span
      onClick={() => onClick(this.emoji)}
      onMouseEnter={() => onOver(this.emoji)}
      onMouseLeave={() => onLeave(this.emoji)}
      className='emoji-picker-emoji'>
      <span style={{
        width: size,
        height: size,
        display: 'inline-block',
        backgroundImage: `url(${sheetURL})`,
        backgroundSize: this.getSheetSize(),
        backgroundPosition: this.getEmojiPosition(this.emoji),
      }}>
      </span>
    </span>
  }
}

Emoji.propTypes = {
  onOver: React.PropTypes.func,
  onLeave: React.PropTypes.func,
  onClick: React.PropTypes.func,
  size: React.PropTypes.number.isRequired,
  emoji: React.PropTypes.string.isRequired,
  sheetURL: React.PropTypes.string.isRequired,
}

Emoji.defaultProps = {
  onOver: (() => {}),
  onLeave: (() => {}),
  onClick: (() => {}),
}
