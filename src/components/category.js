import React from 'react'
import Emoji from './emoji'

export default class Category extends React.Component {
  componentDidMount() {
    this.container = this.refs.container
    this.label = this.refs.label
    this.parent = this.container.parentNode

    this.margin = 0
    this.minMargin = 0

    this.memoizeSize()
  }

  componentDidUpdate() {
    this.memoizeSize()
  }

  memoizeSize() {
    var { top, height } = this.container.getBoundingClientRect()
    var { top: parentTop } = this.parent.getBoundingClientRect()
    var { height: labelHeight } = this.label.getBoundingClientRect()

    this.top = top - parentTop + this.parent.scrollTop
    this.maxMargin = height - labelHeight
  }

  handleScroll(scrollTop) {
    var margin = scrollTop - this.top
    margin = margin < this.minMargin ? this.minMargin : margin
    margin = margin > this.maxMargin ? this.maxMargin : margin

    if (margin == this.margin) return
    this.label.style.top = `${margin}px`
    this.margin = margin
  }

  render() {
    var { name, emojis, hasStickyPosition, emojiProps } = this.props,
        emojis = emojis.slice(0),
        labelStyles = {},
        labelSpanStyles = {}

    if (!hasStickyPosition) {
      labelStyles = {
        height: 28,
      }

      labelSpanStyles = {
        position: 'absolute',
      }
    }

    return <div ref='container' className='emoji-picker-category'>
      <div style={labelStyles} data-name={name} className='emoji-picker-category-label'>
        <span style={labelSpanStyles} ref='label'>{name}</span>
      </div>

      {emojis.map((emoji) =>
        <Emoji
          key={emoji}
          emoji={emoji}
          {...emojiProps}
        />
      )}

      {!emojis.length &&
        <div className='emoji-picker-no-results'>
          <Emoji
            {...emojiProps}
            size={22}
            emoji='sleuth_or_spy'
          />

          <span className='emoji-picker-no-results-label'>
            No emoji found
          </span>
        </div>
      }
    </div>
  }
}

Category.propTypes = {
  emojis: React.PropTypes.array,
  hasStickyPosition: React.PropTypes.bool,
  name: React.PropTypes.string.isRequired,
  emojiProps: React.PropTypes.object.isRequired,
}

Category.defaultProps = {
  emojis: [],
  hasStickyPosition: true,
}
