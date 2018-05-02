import React from 'react'

import data from '../../../data/all.json'
import NimbleEmoji from './nimble-emoji'

import { EmojiPropTypes, EmojiDefaultProps } from '../../utils/shared-props'

// TODO: Use functional components?
// const Emoji = (props) => {
//   for (let k in Emoji.defaultProps) {
//     if (props[k] == undefined && Emoji.defaultProps[k] != undefined) {
//       props[k] = Emoji.defaultProps[k]
//     }
//   }
//
//   return NimbleEmoji({ ...props })
// }

export default class Emoji extends React.PureComponent {
  static propTypes = EmojiPropTypes
  static defaultProps = { ...EmojiDefaultProps, data }

  render() {
    const props = this.props

    for (let k in Emoji.defaultProps) {
      if (props[k] == undefined && Emoji.defaultProps[k] != undefined) {
        props[k] = Emoji.defaultProps[k]
      }
    }

    return <NimbleEmoji {...props} />
  }
}
