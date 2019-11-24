import React from 'react'
import PropTypes from 'prop-types'

import { search as icons } from '../svgs'
import NimbleEmojiIndex from '../utils/emoji-index/nimble-emoji-index'
import { throttleIdleTask } from '../utils/index'

import SkinsEmoji from './skins-emoji'
import GenderEmoji from './gender-emoji'
import SkinsDot from './skins-dot'

let id = 0

export default class Filter extends React.PureComponent {
  render() {
    const { i18n, onGenderChange, skinsProps, emojiProps, data } = this.props

    return (
      <section className="emoji-mart-filter" aria-label={i18n.filter}>
        <GenderEmoji
          gender={0}
          emojis={['man', 'woman']}
          emojiProps={emojiProps}
          data={data}
          onChange={onGenderChange}
        />
        <SkinsDot
          skin={skinsProps.skin}
          i18n={i18n}
          onChange={skinsProps.onChange}
        />
        {/* <SkinsEmoji
          skin={skinsProps.skin}
          emojiProps={emojiProps}
          data={this.data}
          skinEmoji={skinsProps.skinEmoji}
          i18n={i18n}
          onChange={skinsProps.onChange}
        /> */}
      </section>
    )
  }
}

Filter.propTypes /* remove-proptypes */ = {
  onGenderChange: PropTypes.func,
}

Filter.defaultProps = {
  onGenderChange: () => {},
}
