import React from 'react'
import {Emoji, Skins} from '.'

export default class Preview extends React.Component {
  constructor(props) {
    super(props)
    this.state = { emoji: null }
  }

  render() {
    var { emoji } = this.state,
        { emojiProps, skinsProps } = this.props

    if (emoji) {
      var { emoticons } = emoji,
          knownEmoticons = [],
          listedEmoticons = []

      for (let emoticon of emoticons) {
        if (knownEmoticons.indexOf(emoticon.toLowerCase()) == -1) {
          knownEmoticons.push(emoticon.toLowerCase())
          listedEmoticons.push(emoticon)
        }
      }

      return <div className='emoji-picker-preview'>
        <div className='emoji-picker-preview-emoji'>
          <Emoji
            key={emoji.short_name || emoji}
            emoji={emoji}
            {...emojiProps}
          />
        </div>

        <div className='emoji-picker-preview-data'>
          <div className='emoji-picker-preview-name'>{emoji.name}</div>
          <div className='emoji-picker-preview-shortnames'>
            {emoji.short_names.map((short_name) =>
              <span key={short_name} className='emoji-picker-preview-shortname'>:{short_name}:</span>
            )}
          </div>
          <div className='emoji-picker-preview-emoticons'>
            {listedEmoticons.map((emoticon) =>
              <span key={emoticon} className='emoji-picker-preview-emoticon'>{emoticon}</span>
            )}
          </div>
        </div>
      </div>
    } else {
      return <div className='emoji-picker-preview'>
        <div className='emoji-picker-preview-emoji'>
          <Emoji
            emoji='tophat'
            {...emojiProps}
          />
        </div>

        <div className='emoji-picker-preview-data'>
          <span className='emoji-picker-title-label'>
            EmojiPicker
          </span>
        </div>

        <div className='emoji-picker-preview-skins'>
          <Skins
            {...skinsProps}
          />
        </div>
      </div>
    }
  }
}

Preview.propTypes = {
  emojiProps: React.PropTypes.object.isRequired,
  skinsProps: React.PropTypes.object.isRequired,
}
