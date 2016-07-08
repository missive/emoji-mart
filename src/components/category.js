import React from 'react'

import {frequently} from '../utils'
import {Emoji} from '.'

const LABELS = {
  'Search': 'Search Results',
  'Recent': 'Frequently Used',
  'People': 'Smileys & People',
  'Nature': 'Animals & Nature',
  'Foods': 'Food & Drink',
  'Activity': 'Activity',
  'Places': 'Travel & Places',
  'Objects': 'Objects',
  'Symbols': 'Symbols',
  'Flags': 'Flags',
}

export default class Category extends React.Component {
  componentDidMount() {
    this.container = this.refs.container
    this.label = this.refs.label
    this.parent = this.container.parentNode

    this.margin = 0
    this.minMargin = 0

    this.memoizeSize()
  }

  shouldComponentUpdate(nextProps, nextState) {
    var { name, perLine, emojis, emojiProps } = this.props,
        { skin, size, sheetURL } = emojiProps,
        { perLine: nextPerLine, emojis: nextEmojis, emojiProps: nextEmojiProps } = nextProps,
        { skin: nextSkin, size: nextSize, sheetURL: nextSheetURL } = nextEmojiProps,
        shouldUpdate = false

    if (name == 'Recent' && perLine != nextPerLine) {
      shouldUpdate = true
    }

    if (name == 'Search') {
      shouldUpdate = !(emojis == nextEmojis)
    }

    if (skin != nextSkin || size != nextSize || sheetURL != nextSheetURL) {
      shouldUpdate = true
    }

    return shouldUpdate
  }

  memoizeSize() {
    var { top, height } = this.container.getBoundingClientRect()
    var { top: parentTop } = this.parent.getBoundingClientRect()
    var { height: labelHeight } = this.label.getBoundingClientRect()

    this.top = top - parentTop + this.parent.scrollTop
    if (height > labelHeight) {
      this.maxMargin = height - labelHeight
    } else {
      this.maxMargin = 1
    }
  }

  handleScroll(scrollTop) {
    var margin = scrollTop - this.top
    margin = margin < this.minMargin ? this.minMargin : margin
    margin = margin > this.maxMargin ? this.maxMargin : margin

    if (margin == this.margin) return
    var { name } = this.props

    if (!this.props.hasStickyPosition) {
      this.label.style.top = `${margin}px`
    }

    this.margin = margin
    return true
  }

  render() {
    var { name, emojis, perLine, hasStickyPosition, emojiProps } = this.props,
        labelStyles = {},
        labelSpanStyles = {},
        containerStyles = {}

    if (name == 'Recent') {
      let frequentlyUsed = frequently.get(perLine * 4)

      if (frequentlyUsed.length) {
        emojis = frequentlyUsed
      }
    }

    if (emojis) {
      emojis = emojis.slice(0)
    } else {
      containerStyles = {
        height: 1,
        overflow: 'hidden',
        marginBottom: '-1px',
      }
    }

    if (!hasStickyPosition) {
      labelStyles = {
        height: 28,
      }

      labelSpanStyles = {
        position: 'absolute',
      }
    }

    return <div ref='container' className='emoji-picker-category' style={containerStyles}>
      <div style={labelStyles} data-name={name} className='emoji-picker-category-label'>
        <span style={labelSpanStyles} ref='label'>{LABELS[name]}</span>
      </div>

      {emojis && emojis.map((emoji) =>
        <Emoji
          key={emoji}
          emoji={emoji}
          {...emojiProps}
        />
      )}

      {emojis && !emojis.length &&
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
  perLine: React.PropTypes.number.isRequired,
  emojiProps: React.PropTypes.object.isRequired,
}

Category.defaultProps = {
  emojis: [],
  hasStickyPosition: true,
}
