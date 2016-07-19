import React from 'react'

import {Emoji, Skins} from '.'
import {getData} from '../utils'

export default class Preview extends React.Component {
  constructor(props) {
    super(props)
    this.state = { emoji: null }
  }

  render() {
    var { emoji } = this.state,
        { emojiProps, skinsProps, title, emoji: idleEmoji } = this.props

    if (emoji) {
      var emojiData = getData(emoji),
          { emoticons } = emojiData,
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
            key={emoji.id}
            emoji={emoji}
            {...emojiProps}
          />
        </div>

        <div className='emoji-picker-preview-data'>
          <div className='emoji-picker-preview-name'>{emoji.name}</div>
          <div className='emoji-picker-preview-shortnames'>
            {emojiData.short_names.map((short_name) =>
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
            emoji={idleEmoji}
            {...emojiProps}
          />
        </div>

        <div className='emoji-picker-preview-data'>
          <span className='emoji-picker-title-label'>
            {title}
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
  title: React.PropTypes.string.isRequired,
  emoji: React.PropTypes.string.isRequired,
  emojiProps: React.PropTypes.object.isRequired,
  skinsProps: React.PropTypes.object.isRequired,
}
