import React from 'react'
import PropTypes from 'prop-types'
import {
  Platform,
  StyleSheet,
  View,
  TextInput,
  TouchableNativeFeedback,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import NimbleEmojiIndex from '../utils/emoji-index/nimble-emoji-index'

const styles = StyleSheet.create({
  searchContainer: {
    paddingLeft: 5,
    paddingRight: 10,
    paddingTop: 2,
    paddingBottom: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#a2a2a2',
  },
  searchInput: {
    flex: 1,
  },
  closeButtonContainer: {
    width: 44,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 28,
    height: 28,
    margin: 10,
    borderRadius: 500,
  },
  closeButtonIcon: {
    marginTop: 1,
    marginLeft: 2,
  },
})

export default class Search extends React.PureComponent {
  static propTypes = {
    onSearch: PropTypes.func,
    onPressClose: PropTypes.func,
    maxResults: PropTypes.number,
    emojisToShowFilter: PropTypes.func,
    autoFocus: PropTypes.bool,
  }

  static defaultProps = {
    onSearch: () => {},
    onPressClose: () => {},
    maxResults: 75,
    emojisToShowFilter: null,
    autoFocus: false,
  }

  constructor(props) {
    super(props)

    this.data = props.data
    this.emojiIndex = new NimbleEmojiIndex(this.data)
    this.setRef = this.setRef.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    var { value } = event.nativeEvent

    this.props.onSearch(
      this.emojiIndex.search(value, {
        emojisToShowFilter: this.props.emojisToShowFilter,
        maxResults: this.props.maxResults,
        include: this.props.include,
        exclude: this.props.exclude,
        custom: this.props.custom,
      }),
    )
  }

  setRef(c) {
    this.input = c
  }

  clear() {
    this.input.value = ''
  }

  render() {
    var { i18n, autoFocus, onPressClose } = this.props

    let background

    if (Platform.Version >= 21) {
      background = TouchableNativeFeedback.SelectableBackgroundBorderless()
    } else {
      background = TouchableNativeFeedback.SelectableBackground()
    }

    return (
      <View style={styles.searchContainer}>
        <View style={styles.closeButtonContainer}>
          <TouchableNativeFeedback
            onPress={onPressClose}
            background={background}
          >
            <View style={[styles.closeButton]}>
              <Icon
                style={styles.closeButtonIcon}
                name="arrow-left"
                size={24}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <TextInput
          style={styles.searchInput}
          ref={this.setRef}
          onChange={this.handleChange}
          placeholder={i18n.search}
          autoFocus={autoFocus}
          underlineColorAndroid="transparent"
        />
      </View>
    )
  }
}
