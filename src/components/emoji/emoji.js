import React from 'react'

import data from '../../../data/all.json'
import NimbleEmoji from './nimble-emoji'

import { EmojiPropTypes } from '../../utils/shared-props'
import { EmojiDefaultProps } from '../../utils/shared-default-props'

const Emoji = (props) => {
  for (let k in Emoji.defaultProps) {
    if (props[k] == undefined && Emoji.defaultProps[k] != undefined) {
      props[k] = Emoji.defaultProps[k]
    }
  }

  return NimbleEmoji({ ...props })
}

Emoji.propTypes /* remove-proptypes */ = EmojiPropTypes
Emoji.defaultProps = { ...EmojiDefaultProps, data }

export default Emoji
