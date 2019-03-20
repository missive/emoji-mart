import React from 'react'
import PropTypes from 'prop-types'

import NimbleEmoji from './emoji/nimble-emoji'
import Skins from './skins'

export default class SkinsEmoji extends Skins {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    const { skin, emojiProps, data, skinEmoji, i18n } = this.props
    const { opened } = this.state
    const skinToneNodes = []

    for (let skinTone = 1; skinTone <= 6; skinTone++) {
      const selected = skinTone === skin
      skinToneNodes.push(
        <span
          key={`skin-tone-${skinTone}`}
          className={`emoji-mart-skin-swatch custom${
            selected ? ' selected' : ''
          }`}
        >
          <span
            onClick={this.handleClick}
            data-skin={skinTone}
            className={`emoji-mart-skin-tone-${skinTone}`}
          >
            {NimbleEmoji({
              emoji: skinEmoji,
              data: data,
              skin: skinTone,
              backgroundImageFn: emojiProps.backgroundImageFn,
              native: emojiProps.native,
              set: emojiProps.set,
              sheetSize: emojiProps.sheetSize,
              size: 23,
            })}
          </span>
        </span>,
      )
    }

    return (
      <div
        className={`emoji-mart-skin-swatches custom${opened ? ' opened' : ''}`}
      >
        <div className={`emoji-mart-skin-text${opened ? ' opened' : ''}`}>
          {i18n.skintext}
        </div>
        {skinToneNodes}
      </div>
    )
  }
}

SkinsEmoji.propTypes /* remove-proptypes */ = {
  onChange: PropTypes.func,
  skin: PropTypes.number.isRequired,
  emojiProps: PropTypes.object.isRequired,
  skinTone: PropTypes.number,
  skinEmoji: PropTypes.string.isRequired,
  i18n: PropTypes.object,
}

SkinsEmoji.defaultProps = {
  onChange: () => {},
  skinTone: null,
}
