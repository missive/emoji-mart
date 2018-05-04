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

  _getImage = (data) => {
    const { image } = data
    const { skin, set, useLocalImages } = this.props
    const emoji = this._getSanitizedData(this.props)

    let imageSource = {
      uri: `https://unpkg.com/emoji-datasource-${set}@${EMOJI_DATASOURCE_VERSION}/img/${set}/64/${image}`,
    }

    if (useLocalImages && useLocalImages[emoji.id]) {
      return useLocalImages[emoji.id].localImages[set][
        (skin || NimbleEmoji.defaultProps.skin) - 1
      ]
    }

    return imageSource
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
    if (this.props.data.compressed) {
      uncompress(this.props.data)
    }

    for (const k in NimbleEmoji.defaultProps) {
      if (
        this.props[k] === undefined &&
        NimbleEmoji.defaultProps[k] != undefined
      ) {
        this.props[k] = NimbleEmoji.defaultProps[k]
      }
    }

    let data = this._getData(this.props)
    if (!data) {
      return null
    }

    let { unified, custom, short_names, imageUrl } = data,
      style = {},
      imageStyle = {},
      labelStyle = {},
      children = this.props.children,
      title = null,
      emojiImage

    if (!unified && !custom) {
      return null
    }

    if (this.props.tooltip) {
      title = short_names[0]
    }

    if (this.props.native && unified) {
      const fontSize = this.props.size
      labelStyle = { fontSize }
      children = unifiedToNative(unified)
      style.width = this.props.size + this.props.margin
      style.height = this.props.size + this.props.margin
    } else if (custom) {
      style = {
        width: this.props.size,
        height: this.props.size,
        margin: this.props.noMargin ? 0 : this.props.margin / 2,
      }

      imageStyle = {
        width: this.props.size,
        height: this.props.size,
      }

      emojiImage = <Image style={imageStyle} source={{ uri: imageUrl }} />
    } else {
      const setHasEmoji =
        data[`has_img_${this.props.set}`] == undefined ||
        data[`has_img_${this.props.set}`]

      if (!setHasEmoji) {
        if (this.props.fallback) {
          return this.props.fallback(data)
        } else {
          return null
        }
      }

      style = {
        width: this.props.size,
        height: this.props.size,
        margin: this.props.noMargin ? 0 : this.props.margin / 2,
      }

      const emojiImageFile = this._getImage(data)

      imageStyle = {
        width: this.props.size,
        height: this.props.size,
      }

      emojiImage = (
        <Image
          style={imageStyle}
          source={this.props.emojiImageFn(emojiImageFile)}
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

    return this.props.onPress || this.props.onLongPress ? (
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
