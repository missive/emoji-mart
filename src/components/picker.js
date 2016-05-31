import React from 'react'

import data from '../../data'
import Preview from './preview'
import Category from './category'

export default class Picker extends React.Component {
  handleEmojiOver(emoji) {
    var { preview } = this.refs
    preview.setState({ emoji: emoji })
  }

  render() {
    var { perLine, emojiSize, sheetURL } = this.props

    return <div className='emoji-picker'>
      <div className='emoji-picker-bar'>
        Categories
      </div>

      <div ref="scroll" className='emoji-picker-scroll'>
        <input
          type='text'
          placeholder='Search'
          className='emoji-picker-search'
        />

        {data.categories.map((category) => {
          if (category.name == 'Skins') return null
          return <Category
            key={category.name}
            name={category.name}
            emojis={category.emojis}
            perLine={perLine}
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
