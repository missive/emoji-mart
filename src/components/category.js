import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text, FlatList } from 'react-native'

import frequently from '../utils/frequently'
import { getData, getSanitizedData } from '../utils'
import { NimbleEmoji } from '.'

const styles = StyleSheet.create({
  category: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  label: {
    paddingLeft: 2,
    paddingRight: 2,
    alignSelf: 'flex-start',
  },
  labelText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  emojisContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 2,
  },
})

export default class Category extends React.Component {
  static propTypes = {
    emojis: PropTypes.array,
    hasStickyPosition: PropTypes.bool,
    name: PropTypes.string.isRequired,
    native: PropTypes.bool.isRequired,
    perLine: PropTypes.number.isRequired,
    emojiProps: PropTypes.object.isRequired,
    recent: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    emojis: [],
    hasStickyPosition: true,
  }

  constructor(props) {
    super(props)

    this.data = props.data
    this.setContainerRef = this.setContainerRef.bind(this)
    this.setLabelRef = this.setLabelRef.bind(this)

    this.state = {
      visible: true,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    var {
        name,
        perLine,
        native,
        hasStickyPosition,
        emojis,
        emojiProps,
      } = this.props,
      { skin, size, set } = emojiProps,
      {
        perLine: nextPerLine,
        native: nextNative,
        hasStickyPosition: nextHasStickyPosition,
        emojis: nextEmojis,
        emojiProps: nextEmojiProps,
      } = nextProps,
      { skin: nextSkin, size: nextSize, set: nextSet } = nextEmojiProps,
      shouldUpdate = false

    if (name == 'Recent' && perLine != nextPerLine) {
      shouldUpdate = true
    }

    if (name == 'Search') {
      shouldUpdate = !(emojis == nextEmojis)
    }

    if (
      skin != nextSkin ||
      size != nextSize ||
      native != nextNative ||
      set != nextSet ||
      hasStickyPosition != nextHasStickyPosition
    ) {
      shouldUpdate = true
    }

    return shouldUpdate
  }

  // TODO: Remove completely?
  // handleScroll(scrollTop) {
  //   var margin = scrollTop - this.top
  //   margin = margin < this.minMargin ? this.minMargin : margin
  //   margin = margin > this.maxMargin ? this.maxMargin : margin
  //
  //   if (margin == this.margin) return
  //
  //   if (!this.props.hasStickyPosition) {
  //     this.label.style.top = `${margin}px`
  //   }
  //
  //   this.margin = margin
  //   return true
  // }

  getEmojis() {
    var { name, emojis, recent, perLine, emojiProps } = this.props
    const { set: emojiSet } = emojiProps

    if (name == 'Recent') {
      let { custom } = this.props
      let frequentlyUsed = recent || frequently.get(perLine)

      if (frequentlyUsed.length) {
        emojis = frequentlyUsed
          .map((id) => {
            const emoji = custom.filter((e) => e.id === id)[0]
            if (emoji) {
              return emoji
            }

            return id
          })
          .filter((id) => !!getData(id, null, null, this.data))
      }

      if (emojis.length === 0 && frequentlyUsed.length > 0) {
        return null
      }
    }

    if (emojis) {
      emojis = emojis.slice(0)
    }

    return emojis
  }

  updateDisplay(visible) {
    var emojis = this.getEmojis()

    if (!emojis) {
      return
    }

    this.setState({ visible })
  }

  setContainerRef(c) {
    this.container = c
  }

  setLabelRef(c) {
    this.label = c
  }

  onLayout = () => {
    if (this.container) {
      this.container.measure((x, y, widht, height, pageX, pageY) => {
        this.top = pageY
      })
    }
  }

  _getSanitizedData = (props) => {
    const { emoji, skin, set } = props
    return getSanitizedData(emoji, skin, set, this.data)
  }

  flatListKeyExtractor = (item) => {
    const { emojiProps } = this.props
    const emoji = this._getSanitizedData({ emoji: item, ...emojiProps })

    return `${this.props.name}_emoji_${emoji.id}`
  }

  getFlatListItemLayout = (layoutData, index) => {
    const { emojiProps } = this.props
    const {
      size: emojiSize,
      margin: emojiMargin,
      noMargin: emojiNoMargin,
    } = emojiProps

    const emojiSizing = emojiNoMargin ? emojiSize : emojiSize + emojiMargin
    return {
      length: emojiSizing,
      offset: emojiSizing * index,
      index,
    }
  }

  renderFlatListItem = ({ item }) => {
    const { emojiProps, name } = this.props
    const emoji = this._getSanitizedData({ emoji: item, ...emojiProps })

    return (
      <NimbleEmoji
        key={`${name}_emoji_${emoji.item}`}
        emoji={emoji}
        data={this.data}
        {...emojiProps}
      />
    )
  }

  render() {
    var { id, name, hasStickyPosition, emojiProps, i18n, perLine } = this.props,
      emojis = this.getEmojis(),
      { visible } = this.state

    const { size: emojiSize, margin: emojiMargin } = emojiProps

    const emojiSizing = emojiSize + emojiMargin
    const emojisListWidth = perLine * emojiSizing + emojiMargin

    return !emojis || !visible ? null : (
      <View
        ref={this.setContainerRef}
        onLayout={this.onLayout}
        style={[
          styles.category,
          emojis && !emojis.length ? styles.noResults : null,
        ]}
      >
        <View style={styles.label}>
          <Text style={styles.labelText} ref={this.setLabelRef}>
            {i18n.categories[id]}
          </Text>
        </View>

        {emojis.length ? (
          <FlatList
            data={emojis}
            keyExtractor={this.flatListKeyExtractor}
            getItemLayout={this.getFlatListItemLayout}
            renderItem={this.renderFlatListItem}
            numColumns={perLine}
            columnWrapperStyle={[
              styles.emojisContainer,
              { width: emojisListWidth },
            ]}
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          <View>
            <View>
              <NimbleEmoji
                data={this.data}
                {...emojiProps}
                emoji="sleuth_or_spy"
                onPress={null}
                onLongPress={null}
              />
            </View>

            <View style={styles.label}>
              <Text style={styles.labelText}>{i18n.notfound}</Text>
            </View>
          </View>
        )}
      </View>
    )
  }
}
