import React from 'react'

import data from '../../data'
import Preview from './preview'
import Category from './category'

export default class Picker extends React.Component {
  componentWillMount() {
    var stickyTestElement = document.createElement('div')
    for (let prefix of ['', '-webkit-', '-ms-', '-moz-', '-o-']) {
      stickyTestElement.style.position = `${prefix}sticky`
    }

    this.hasStickyPosition = !!stickyTestElement.style.position.length
  }

  componentDidUpdate() {
    this.handleScroll()
  }

  handleEmojiOver(emoji) {
    var { preview } = this.refs
    preview.setState({ emoji: emoji })
  }

  handleScroll() {
    var target = this.refs.scroll,
        scrollTop = target.scrollTop

    if (!this.hasStickyPosition) {
      Array(data.categories.length).fill().forEach((_, i) => {
        var category = this.refs[`category-${i}`]
        if (category) {
          category.handleScroll(scrollTop)
        }
      })
    }
  }

  render() {
    var { perLine, emojiSize, sheetURL } = this.props

    return <div className='emoji-picker'>
      <div className='emoji-picker-bar'>
        Categories
      </div>

      <div ref="scroll" className='emoji-picker-scroll' onScroll={this.handleScroll.bind(this)}>
        <input
          type='text'
          placeholder='Search'
          className='emoji-picker-search'
        />

        {data.categories.map((category, i) => {
          if (category.name == 'Skins') return null
          return <Category
            ref={`category-${i}`}
            key={category.name}
            name={category.name}
            emojis={category.emojis}
            perLine={perLine}
            hasStickyPosition={this.hasStickyPosition}
            emojiProps={{
              size: emojiSize,
              sheetURL: sheetURL,
              onOver: this.handleEmojiOver.bind(this),
              onClick: this.props.onClick,
            }}
          />
        })}
      </div>

      <div className='emoji-picker-bar emoji-picker-preview'>
        <Preview
          ref='preview'
          emojiProps={{
            size: 38,
            sheetURL: sheetURL,
          }}
        />
      </div>
    </div>
  }
}

Picker.propTypes = {
  onClick: React.PropTypes.func,
  perLine: React.PropTypes.number,
  emojiSize: React.PropTypes.number,
  sheetURL: React.PropTypes.string.isRequired,
}

Picker.defaultProps = {
  onClick: (() => {}),
  emojiSize: 32,
  perLine: 9,
}
