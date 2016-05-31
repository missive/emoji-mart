import React from 'react'
import data from '../../data'

const SHEET_SIZE = 2624
const EMOJI_SIZE = 64

export default class Emoji extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.size != this.props.size ||
      nextProps.sheetURL != this.props.sheetURL
    )
  }

  getEmojiData() {
    var { emoji } = this.props,
        emojiData = emoji

    if (typeof emoji == 'string') {
      emojiData = data.emojis[emoji]
    }

    return emojiData
  }

  getSheetSize() {
    var { size } = this.props,
        sheetSize = SHEET_SIZE * size / EMOJI_SIZE

    return `${sheetSize}px ${sheetSize}px`
  }

  getPosition(emojiData) {
    var { size } = this.props,
        { sheet_x, sheet_y } = emojiData,
        x = sheet_x * size,
        y = sheet_y * size

    return `-${x}px -${y}px`
  }

  render() {
    var { sheetURL, size, onOver, onLeave, onClick } = this.props,
        emojiData = this.getEmojiData()

    return <span
      onClick={() => onClick(emojiData)}
      onMouseEnter={() => onOver(emojiData)}
      onMouseLeave={() => onLeave(emojiData)}
      className='emoji-picker-emoji'>
      <span style={{
        width: size,
        height: size,
        display: 'inline-block',
        backgroundImage: `url(${sheetURL})`,
        backgroundSize: this.getSheetSize(),
        backgroundPosition: this.getPosition(emojiData),
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
  sheetURL: React.PropTypes.string.isRequired,
  emoji: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
  ]).isRequired,
}

Emoji.defaultProps = {
  onOver: (() => {}),
  onLeave: (() => {}),
  onClick: (() => {}),
}
