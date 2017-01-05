import React from 'react'

import { Emoji, Skins } from '.'
import { getData } from '../utils'

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

      return <div className='emoji-mart-preview'>
        <div className='emoji-mart-preview-emoji'>
          <Emoji
            key={emoji.id}
            emoji={emoji}
            {...emojiProps}
          />
        </div>

        <div className='emoji-mart-preview-data'>
          <div className='emoji-mart-preview-name'>{emoji.name}</div>
        </div>
      </div>
    } else {
      return <div className='emoji-mart-preview'>
        <div className='emoji-mart-preview-emoji'>
          <Emoji
            emoji={idleEmoji}
            {...emojiProps}
          />
        </div>

        <div className='emoji-mart-preview-data'>
          <span className='emoji-mart-title-label'>
            {title}
          </span>
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
