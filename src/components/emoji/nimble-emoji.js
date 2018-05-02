import React from 'react'
import PropTypes from 'prop-types'
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
} from 'react-native'

import { getData, getSanitizedData, unifiedToNative } from '../../utils'
import { uncompress } from '../../utils/data'
import { EmojiPropTypes, EmojiDefaultProps } from '../../utils/shared-props'

const styles = StyleSheet.create({
  emojiWrapper: {
    overflow: 'hidden',
  },
  labelStyle: {
    textAlign: 'center',
    color: '#ae65c5',
  },
})

// TODO: Use functional components?
// const NimbleEmoji = (props) => {
class NimbleEmoji extends React.PureComponent {
  static propTypes = { ...EmojiPropTypes, data: PropTypes.object.isRequired }
  static defaultProps = EmojiDefaultProps

  _getImage = (props) => {
    const { image, localImages } = this._getData(props)
    const { skin } = this.props

    /**
     * If no localImages param for this emoji and useLocalImages is true
     * code below could cause problems in the emojiImageFn function.
     */
    if (localImages && props.useLocalImages) {
      return localImages[props.set][(skin || NimbleEmoji.defaultProps.skin) - 1]
    }

    return image
  }

  _getData = (props) => {
    const { emoji, skin, set, data } = props
    return getData(emoji, skin, set, data)
  }

  _getSanitizedData = (props) => {
    const { emoji, skin, set, data } = props
    return getSanitizedData(emoji, skin, set, data)
  }

  _handlePress = (e) => {
    const { onPress } = this.props
    if (!onPress) {
      return
    }
    const emoji = this._getSanitizedData(this.props)

    onPress(emoji, e)
  }

  _handleLongPress = (e) => {
    const { onLongPress } = this.props
    if (!onLongPress) {
      return
    }
    const emoji = this._getSanitizedData(this.props)

    onLongPress(emoji, e)
  }

  render() {
    const props = this.props

    if (props.data.compressed) {
      uncompress(props.data)
    }

    for (let k in NimbleEmoji.defaultProps) {
      if (props[k] == undefined && NimbleEmoji.defaultProps[k] != undefined) {
        props[k] = NimbleEmoji.defaultProps[k]
      }
    }

    let data = this._getData(props)
    if (!data) {
      return null
    }

    let { unified, custom, short_names, imageUrl } = data,
      style = {},
      children = props.children,
      className = 'emoji-mart-emoji',
      title = null,
      emojiImage

    if (!unified && !custom) {
      return null
    }

    if (props.tooltip) {
      title = short_names[0]
    }

    if (props.native && unified) {
      const fontSize = props.size
      labelStyle = { fontSize }
      children = unifiedToNative(unified)
      style.width = props.size + margin
      style.height = props.size + margin
    } else if (custom) {
      style = {
        width: props.size,
        height: props.size,
        margin: noMargin ? 0 : margin / 2,
      }

      imageStyle = {
        width: props.size,
        height: props.size,
      }

      emojiImage = <Image style={imageStyle} source={{ uri: imageUrl }} />
    } else {
      const setHasEmoji =
        data[`has_img_${props.set}`] == undefined ||
        data[`has_img_${props.set}`]

      if (!setHasEmoji) {
        if (props.fallback) {
          return props.fallback(data)
        } else {
          return null
        }
      }

      style = {
        width: props.size,
        height: props.size,
        margin: noMargin ? 0 : margin / 2,
      }

      const emojiImageFile = _getImage(props)

      imageStyle = {
        width: props.size,
        height: props.size,
      }

      emojiImage = (
        <Image
          style={imageStyle}
          source={props.emojiImageFn(props.set, emojiImageFile, useLocalImages)}
        />
      )
    }

    const emojiComponent = (
      <View style={[styles.emojiWrapper, style]}>
        {emojiImage || (
          <Text style={[styles.labelStyle, labelStyle]}>{children}</Text>
        )}
      </View>
    )

    return onPress || onLongPress ? (
      <TouchableWithoutFeedback
        onPress={this._handlePress}
        onLongPress={this._handleLongPress}
      >
        {emojiComponent}
      </TouchableWithoutFeedback>
    ) : (
      emojiComponent
    )
  }
}

export default NimbleEmoji
