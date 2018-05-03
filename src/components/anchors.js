import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native'

import { NimbleEmoji } from '.'

const styles = StyleSheet.create({
  anchors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  anchor: {
    flex: 1,
    paddingTop: 13,
    paddingBottom: 13,
    paddingLeft: 18,
    paddingRight: 18,
    overflow: 'hidden',
  },
  anchorBar: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 2,
  },
  anchordBarSelected: {
    bottom: 0,
  },
})

export default class Anchors extends React.PureComponent {
  static propTypes = {
    categories: PropTypes.array,
    onAnchorPress: PropTypes.func,
    emojiProps: PropTypes.object.isRequired,
    categoryEmojis: PropTypes.object.isRequired,
  }

  static defaultProps = {
    categories: [],
    onAnchorPress: () => {},
  }

  constructor(props) {
    super(props)

    let defaultCategory = props.categories.filter(
      (category) => category.first,
    )[0]

    this.data = props.data
    this.state = {
      selected: defaultCategory.name,
    }

    this.handlePress = this.handlePress.bind(this)
  }

  handlePress(index) {
    var { categories, onAnchorPress } = this.props

    onAnchorPress(categories[index], index)
  }

  render() {
    var {
        categories,
        onAnchorPress,
        color,
        i18n,
        emojiProps,
        categoryEmojis,
      } = this.props,
      { selected } = this.state

    return (
      <View style={styles.anchors}>
        {categories.map((category, i) => {
          var { id, name, anchor } = category,
            isSelected = name == selected

          if (anchor === false) {
            return null
          }

          return (
            <TouchableWithoutFeedback
              key={id}
              data-index={i}
              onClick={() => this.handlePress(i)}
            >
              <View
                style={[
                  styles.anchor,
                  isSelected ? styles.anchorSelected : null,
                ]}
              >
                <NimbleEmoji
                  data={this.data}
                  {...emojiProps}
                  emoji={categoryEmojis[id]}
                  onPress={null}
                  onLongPress={null}
                />
                <View
                  style={[
                    styles.anchorBar,
                    isSelected ? styles.anchorBarSelected : null,
                    { backgroundColor: color },
                  ]}
                />
              </View>
            </TouchableWithoutFeedback>
          )
        })}
      </View>
    )
  }
}
