import React from 'react'

import frequently from '../utils/frequently'
import {nativeIsSupported} from '../utils'
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
    var { name, perLine, hasStickyPosition, emojis, emojiProps, excludeUnsupportedNativeEmojis } = this.props,
        { skin, size, sheetURL } = emojiProps,
        { perLine: nextPerLine, hasStickyPosition: nextHasStickyPosition, emojis: nextEmojis, emojiProps: nextEmojiProps, excludeUnsupportedNativeEmojis: nextExcludeUnsupportedNativeEmojis } = nextProps,
        { skin: nextSkin, size: nextSize, sheetURL: nextSheetURL } = nextEmojiProps,
        shouldUpdate = false

    if (name == 'Recent' && perLine != nextPerLine) {
      shouldUpdate = true
    }

    if (name == 'Search') {
      shouldUpdate = !(emojis == nextEmojis)
    }

    if (skin != nextSkin || size != nextSize || sheetURL != nextSheetURL || hasStickyPosition != nextHasStickyPosition, excludeUnsupportedNativeEmojis != nextExcludeUnsupportedNativeEmojis) {
      shouldUpdate = true
    }

    return shouldUpdate
  }

  memoizeSize() {
    var { top, height } = this.container.getBoundingClientRect()
    var { top: parentTop } = this.parent.getBoundingClientRect()
    var { height: labelHeight } = this.label.getBoundingClientRect()

    this.top = top - parentTop + this.parent.scrollTop

    if (height == 0) {
      this.maxMargin = 0
    } else {
      this.maxMargin = height - labelHeight
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

  getEmojis() {
    var { name, emojis, perLine } = this.props

    if (name == 'Recent') {
      let frequentlyUsed = frequently.get(perLine * 4)

      if (frequentlyUsed.length) {
        emojis = frequentlyUsed
      }
    }

    if (emojis) {
      emojis = emojis.slice(0)
    }

    return emojis
  }

  updateDisplay(display) {
    var emojis = this.getEmojis()

    if (!display && !emojis) {
      return
    }

    this.container.style.display = display
  }

  render() {
    var { name, hasStickyPosition, excludeUnsupportedNativeEmojis, emojiProps } = this.props,
        emojis = this.getEmojis(),
        labelStyles = {},
        labelSpanStyles = {},
        containerStyles = {}

    if (!emojis) {
      containerStyles = {
        display: 'none',
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

    return <div ref='container' className='emoji-mart-category' style={containerStyles}>
      <div style={labelStyles} data-name={name} className='emoji-mart-category-label'>
        <span style={labelSpanStyles} ref='label'>{LABELS[name]}</span>
      </div>

      {emojis && emojis.map((emoji) => {
        if (excludeUnsupportedNativeEmojis && !nativeIsSupported(emoji, emojiProps.skin, emojiProps.sheetURL)) {
          return null
        }

        return <Emoji
          key={emoji.id || emoji}
          emoji={emoji}
          {...emojiProps}
        />
      })}

      {emojis && !emojis.length &&
        <div className='emoji-mart-no-results'>
          <Emoji
            {...emojiProps}
            size={22}
            emoji='sleuth_or_spy'
          />

          <span className='emoji-mart-no-results-label'>
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
  excludeUnsupportedNativeEmojis: React.PropTypes.bool.isRequired,
}

Category.defaultProps = {
  emojis: [],
  hasStickyPosition: true,
}
