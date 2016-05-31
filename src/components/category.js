import React from 'react'
import Emoji from './emoji'

export default class Category extends React.Component {
  shouldComponentUpdate(props) {
    if (props.perLine != this.props.perLine) {
      return true
    }

    for (let k in props.emojiProps) {
      if (props.emojiProps[k] != this.props.emojiProps[k]) {
        return true
      }
    }

    return false
  }

  render() {
    var { name, emojis, perLine, emojiProps } = this.props,
        emojis = emojis.slice(0),
        lines = [],
        linesCount = Math.ceil(emojis.length / perLine)

    Array(linesCount).fill().forEach((_, i) =>
      lines.push(emojis.splice(0, perLine))
    )

    return <div className='emoji-picker-category'>
      <div className='emoji-picker-category-label'>{name}</div>
      {lines.map((emojis, i) =>
        <div key={`line-${i}`}>
          {emojis.map((emoji) =>
            <Emoji
              key={emoji}
              emoji={emoji}
              {...emojiProps}
            />
          )}
        </div>
      )}
    </div>
  }
}

Category.propTypes = {
  emojis: React.PropTypes.array,
  name: React.PropTypes.string.isRequired,
  perLine: React.PropTypes.number.isRequired,
  emojiProps: React.PropTypes.object.isRequired,
}

Category.defaultProps = {
  emojis: [],
}
