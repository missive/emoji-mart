import React from 'react'
import PropTypes from 'prop-types'

import frequently from '../utils/frequently'
import { Emoji } from '.'

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
    var { name, perLine, native, hasStickyPosition, emojis, emojiProps } = this.props,
        { skin, size, set } = emojiProps,
        { perLine: nextPerLine, native: nextNative, hasStickyPosition: nextHasStickyPosition, emojis: nextEmojis, emojiProps: nextEmojiProps } = nextProps,
        { skin: nextSkin, size: nextSize, set: nextSet } = nextEmojiProps,
        shouldUpdate = false

    if (name == 'Recent' && perLine != nextPerLine) {
      shouldUpdate = true
    }

    if (name == 'Search') {
      shouldUpdate = !(emojis == nextEmojis)
    }

    if (skin != nextSkin || size != nextSize || native != nextNative || set != nextSet || hasStickyPosition != nextHasStickyPosition) {
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
      let { custom } = this.props
      let frequentlyUsed = frequently.get(perLine)

      if (frequentlyUsed.length) {
        emojis = frequentlyUsed.map((id) => {
          for (let emoji of custom) {
            if (emoji.id === id) {
              return emoji
            }
          }

          return id
        })
      }
    }

    if (emojis) {
      emojis = emojis.slice(0)
    }

    return emojis
  }

  updateDisplay(display) {
    var emojis = this.getEmojis()

    if (!emojis) {
      return
    }

    this.container.style.display = display
  }

  render() {
    var { name, hasStickyPosition, emojiProps, i18n } = this.props,
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

    return <div ref='container' className={`emoji-mart-category ${emojis && !emojis.length ? 'emoji-mart-no-results' : ''}`} style={containerStyles}>
      <div style={labelStyles} data-name={name} className='emoji-mart-category-label'>
        <span style={labelSpanStyles} ref='label'>{i18n.categories[name.toLowerCase()]}</span>
      </div>

      {emojis && emojis.map((emoji) =>
        Emoji({
          emoji: emoji,
          ...emojiProps
        })
      )}

      {emojis && !emojis.length &&
        <div>
          <div>
          {Emoji({
            ...emojiProps,
            size: 38,
            emoji: 'sleuth_or_spy',
            onOver: null,
            onLeave: null,
            onClick: null,
          })}
          </div>

          <div className='emoji-mart-no-results-label'>
            {i18n.notfound}
          </div>
        </div>
      }
    </div>
  }
}

Category.propTypes = {
  emojis: PropTypes.array,
  hasStickyPosition: PropTypes.bool,
  name: PropTypes.string.isRequired,
  native: PropTypes.bool.isRequired,
  perLine: PropTypes.number.isRequired,
  emojiProps: PropTypes.object.isRequired,
}

Category.defaultProps = {
  emojis: [],
  hasStickyPosition: true,
}
