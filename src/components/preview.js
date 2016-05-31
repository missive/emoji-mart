import React from 'react'
import Emoji from './emoji'

export default class Preview extends React.Component {
  constructor(props) {
    super(props)
    this.state = { emoji: null }
  }

  render() {
    var { emoji } = this.state,
        { emojiProps } = this.props

    if (emoji) {
      return <div>
        <div className='emoji-picker-preview-emoji'>
          <Emoji
            key={emoji.short_name || emoji}
            emoji={emoji}
            {...emojiProps}
          />
        </div>

        <div className='emoji-picker-preview-data'>
          <span className='emoji-picker-preview-name'>{emoji.name}</span><br />
          <span className='emoji-picker-preview-shortnames'>
            {emoji.short_names.map((short_name) =>
              <span key={short_name} className='emoji-picker-preview-shortname'>:{short_name}:</span>
            )}
          </span>
        </div>
      </div>
    } else {
      return <div>
        EmojiPicker
      </div>
    }
  }
}

Preview.propTypes = {
  emojiProps: React.PropTypes.object.isRequired,
}
