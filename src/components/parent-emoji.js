import React from 'react'
import data from '../data'
import { EmojiPropTypes, EmojiDefaultProps } from '../utils/shared-props'
import NimbleEmoji from './emoji'

export default class Emoji extends React.PureComponent {
  render() {
    return <NimbleEmoji {...this.props} {...this.state} />
  }
}

Emoji.propTypes = EmojiPropTypes
Emoji.defaultProps = { ...EmojiDefaultProps, data }
