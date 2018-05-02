import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

import ButtonSvg from '../svgs/button'

const styles = StyleSheet.create({
  emojiButton: {
    width: 20,
    height: 20,
  },
})

export default class EmojiButton extends React.PureComponent {
  static propTypes = {
    onButtonPress: PropTypes.func,
  }

  static defaultProps = {
    onButtonPress: () => {},
  }

  render() {
    return (
      <TouchableOpacity onPress={this.props.onButtonPress}>
        <View style={styles.emojiButton}>{ButtonSvg}</View>
      </TouchableOpacity>
    )
  }
}
