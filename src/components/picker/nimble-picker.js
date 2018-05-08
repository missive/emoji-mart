import '../../vendor/raf-polyfill'

import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, ScrollView, ToastAndroid } from 'react-native'

import store from '../../utils/store'
import frequently from '../../utils/frequently'
import { deepMerge, measureScrollbar } from '../../utils'
import { uncompress } from '../../utils/data'
import { PickerPropTypes, PickerDefaultProps } from '../../utils/shared-props'

import { Anchors, Category, Search } from '..'

const I18N = {
  search: 'Search',
  notfound: 'No Emoji Found',
  categories: {
    search: 'Search Results',
    recent: 'Frequently Used',
    people: 'Smileys & People',
    nature: 'Animals & Nature',
    foods: 'Food & Drink',
    activity: 'Activity',
    places: 'Travel & Places',
    objects: 'Objects',
    symbols: 'Symbols',
    flags: 'Flags',
    custom: 'Custom',
  },
}

const styles = StyleSheet.create({
  emojiMart: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  emojiMartModal: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  emojiMartScroll: {
    flex: 1,
    flexGrow: 1,
  },
  emojiMartScrollContent: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  emojiMartAnchors: {
    flexShrink: 0,
    maxHeight: 150,
  },
})

export default class NimblePicker extends React.PureComponent {
  static propTypes = {
    ...PickerPropTypes,
    data: PropTypes.object.isRequired,
  }
  static defaultProps = { ...PickerDefaultProps }

  constructor(props) {
    super(props)

    this.RECENT_CATEGORY = { id: 'recent', name: 'Recent', emojis: null }
    this.CUSTOM_CATEGORY = { id: 'custom', name: 'Custom', emojis: [] }
    this.SEARCH_CATEGORY = {
      id: 'search',
      name: 'Search',
      emojis: null,
      anchor: false,
    }

    if (props.data.compressed) {
      uncompress(props.data)
    }

    this.data = props.data
    this.i18n = deepMerge(I18N, props.i18n)
    this.state = {
      skin: props.skin || store.get('skin') || props.defaultSkin,
      firstRender: true,
    }

    this.categories = []
    let allCategories = [].concat(this.data.categories)

    if (props.custom.length > 0) {
      this.CUSTOM_CATEGORY.emojis = props.custom.map((emoji) => {
        return {
          ...emoji,
          // `<Category />` expects emoji to have an `id`.
          id: emoji.short_names[0],
          custom: true,
        }
      })

      allCategories.push(this.CUSTOM_CATEGORY)
    }

    this.hideRecent = true

    if (props.include != undefined) {
      allCategories.sort((a, b) => {
        if (props.include.indexOf(a.id) > props.include.indexOf(b.id)) {
          return 1
        }

        return -1
      })
    }

    for (
      let categoryIndex = 0;
      categoryIndex < allCategories.length;
      categoryIndex++
    ) {
      const category = allCategories[categoryIndex]
      let isIncluded =
        props.include && props.include.length
          ? props.include.indexOf(category.id) > -1
          : true
      let isExcluded =
        props.exclude && props.exclude.length
          ? props.exclude.indexOf(category.id) > -1
          : false
      if (!isIncluded || isExcluded) {
        continue
      }

      if (props.emojisToShowFilter) {
        let newEmojis = []

        const { emojis } = category
        for (let emojiIndex = 0; emojiIndex < emojis.length; emojiIndex++) {
          const emoji = emojis[emojiIndex]
          if (props.emojisToShowFilter(this.data.emojis[emoji] || emoji)) {
            newEmojis.push(emoji)
          }
        }

        if (newEmojis.length) {
          let newCategory = {
            emojis: newEmojis,
            name: category.name,
            id: category.id,
          }

          this.categories.push(newCategory)
        }
      } else {
        this.categories.push(category)
      }
    }

    let includeRecent =
      props.include && props.include.length
        ? props.include.indexOf(this.RECENT_CATEGORY.id) > -1
        : true
    let excludeRecent =
      props.exclude && props.exclude.length
        ? props.exclude.indexOf(this.RECENT_CATEGORY.id) > -1
        : false
    if (includeRecent && !excludeRecent) {
      this.hideRecent = false
      this.categories.unshift(this.RECENT_CATEGORY)
    }

    if (this.categories[0]) {
      this.categories[0].first = true
    }

    this.categories.unshift(this.SEARCH_CATEGORY)

    this.setAnchorsRef = this.setAnchorsRef.bind(this)
    this.handleAnchorPress = this.handleAnchorPress.bind(this)
    this.setSearchRef = this.setSearchRef.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.setScrollViewRef = this.setScrollViewRef.bind(this)
    this.setScrollRef = this.setScrollRef.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.handleScrollPaint = this.handleScrollPaint.bind(this)
    this.handleEmojiPress = this.handleEmojiPress.bind(this)
    this.handleEmojiSelect = this.handleEmojiSelect.bind(this)
    this.handleEmojiLongPress = this.handleEmojiLongPress.bind(this)
    this.handleSkinChange = this.handleSkinChange.bind(this)
  }

  componentWillReceiveProps(props) {
    if (props.skin) {
      this.setState({ skin: props.skin })
    } else if (props.defaultSkin && !store.get('skin')) {
      this.setState({ skin: props.defaultSkin })
    }
  }

  componentDidMount() {
    if (this.state.firstRender) {
      this.firstRenderTimeout = setTimeout(() => {
        this.setState({ firstRender: false })
      }, 60)
    }
  }

  componentDidUpdate() {
    this.updateCategoriesSize()
    this.handleScroll()
  }

  componentWillUnmount() {
    this.SEARCH_CATEGORY.emojis = null

    clearTimeout(this.leaveTimeout)
    clearTimeout(this.firstRenderTimeout)
  }

  handleEmojiPress(emoji, e) {
    this.props.onPress(emoji, e)
    this.handleEmojiSelect(emoji)
  }

  handleEmojiSelect(emoji) {
    this.props.onSelect(emoji)
    if (!this.hideRecent && !this.props.recent) frequently.add(emoji)

    var component = this.categoryRefs['category-1']
    if (component) {
      let maxMargin = component.maxMargin
      component.forceUpdate()
      component.onLayout()
    }
  }

  handleEmojiLongPress(emoji, e) {
    this.props.onLongPress(emoji, e)

    ToastAndroid.showWithGravityAndOffset(
      emoji.id,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      190,
    )
  }

  handleScroll() {
    if (!this.waitingForPaint) {
      this.waitingForPaint = true
      this.handleScrollPaint()
    }
  }

  handleScrollPaint() {
    this.waitingForPaint = false

    if (!this.scroll) {
      return
    }

    // TODO: Change active category depending on scroll position.
    // let activeCategory = null
    //
    // if (this.SEARCH_CATEGORY.emojis) {
    //   activeCategory = this.SEARCH_CATEGORY
    // } else {
    //   var target = this.scroll,
    //     scrollTop = target.scrollTop,
    //     scrollingDown = scrollTop > (this.scrollTop || 0),
    //     minTop = 0
    //
    //   for (let i = 0, l = this.categories.length; i < l; i++) {
    //     let ii = scrollingDown ? this.categories.length - 1 - i : i,
    //       category = this.categories[ii],
    //       component = this.categoryRefs[`category-${ii}`]
    //
    //     if (component) {
    //       let active = component.handleScroll(scrollTop)
    //
    //       if (!minTop || component.top < minTop) {
    //         if (component.top > 0) {
    //           minTop = component.top
    //         }
    //       }
    //
    //       if (active && !activeCategory) {
    //         activeCategory = category
    //       }
    //     }
    //   }
    //
    //   if (scrollTop < minTop) {
    //     activeCategory = this.categories.filter(
    //       (category) => !(category.anchor === false),
    //     )[0]
    //   } else if (scrollTop + this.clientHeight >= this.scrollHeight) {
    //     activeCategory = this.categories[this.categories.length - 1]
    //   }
    // }
    //
    // if (activeCategory) {
    //   let { anchors } = this,
    //     { name: categoryName } = activeCategory
    //
    //   if (anchors.state.selected != categoryName) {
    //     anchors.setState({ selected: categoryName })
    //   }
    // }
    //
    // this.scrollTop = scrollTop
  }

  handleSearch(emojis) {
    this.SEARCH_CATEGORY.emojis = emojis

    for (let i = 0, l = this.categories.length; i < l; i++) {
      let component = this.categoryRefs[`category-${i}`]

      if (component && component.props.name != 'Search') {
        let display = emojis ? false : true
        component.forceUpdate()
        component.updateDisplay(display)
      }
    }

    this.forceUpdate()
    this.scroll.scrollTo({ y: 0, animated: true })
    this.handleScroll()
  }

  onScrollViewLayout = () => {
    this.scrollView.measure((x, y, width, height, pageX, pageY) => {
      this.scrollTop = pageY

      for (let i = 0, l = this.categories.length; i < l; i++) {
        const component = this.categoryRefs[`category-${i}`]
        if (component && component.container) component.onLayout()
      }
    })
  }

  handleAnchorPress(category, i) {
    var component = this.categoryRefs[`category-${i}`],
      { scroll, anchors } = this,
      scrollToComponent = null

    scrollToComponent = () => {
      if (component) {
        let { top } = component

        if (category.first) {
          top = 0
        } else {
          top -= this.scrollTop
        }

        scroll.scrollTo({ y: top, animated: true })
      }
    }

    if (this.SEARCH_CATEGORY.emojis) {
      this.handleSearch(null)
      this.search.clear()
    }

    scrollToComponent()
  }

  handleSkinChange(skin) {
    var newState = { skin: skin },
      { onSkinChange } = this.props

    this.setState(newState)
    store.update(newState)

    onSkinChange(skin)
  }

  updateCategoriesSize() {
    for (let i = 0, l = this.categories.length; i < l; i++) {
      let component = this.categoryRefs[`category-${i}`]
      if (component) component.onLayout()
    }

    // if (this.scroll) {
    //   let target = this.scroll
    //   this.scrollHeight = target.scrollHeight
    //   this.clientHeight = target.clientHeight
    // }
  }

  getCategories() {
    return this.state.firstRender
      ? this.categories.slice(0, 3)
      : this.categories
  }

  setAnchorsRef(c) {
    this.anchors = c
  }

  setSearchRef(c) {
    this.search = c
  }

  setScrollViewRef(c) {
    this.scrollView = c
  }

  setScrollRef(c) {
    this.scroll = c
  }

  setCategoryRef(name, c) {
    if (!this.categoryRefs) {
      this.categoryRefs = {}
    }

    this.categoryRefs[name] = c
  }

  render() {
    var {
        perLine,
        emojiSize,
        emojiMargin,
        anchorSize,
        set,
        style,
        title,
        emoji,
        color,
        native,
        emojiImageFn,
        emojisToShowFilter,
        showSkinTones,
        showAnchors,
        emojiTooltip,
        include,
        exclude,
        recent,
        autoFocus,
        modal,
        useLocalImages,
        categoryEmojis,
        onPressClose,
      } = this.props,
      { skin } = this.state

    return (
      <View
        style={[
          { ...style },
          styles.emojiMart,
          modal ? styles.emojiMartModal : null,
        ]}
      >
        <Search
          ref={this.setSearchRef}
          onSearch={this.handleSearch}
          data={this.data}
          i18n={this.i18n}
          emojisToShowFilter={emojisToShowFilter}
          include={include}
          exclude={exclude}
          custom={this.CUSTOM_CATEGORY.emojis}
          autoFocus={autoFocus}
          onPressClose={onPressClose}
        />

        <View
          ref={this.setScrollViewRef}
          onLayout={this.onScrollViewLayout}
          style={styles.emojiMartScroll}
        >
          <ScrollView
            ref={this.setScrollRef}
            style={styles.emojiMartScroll}
            contentContainerStyle={styles.emojiMartScrollContent}
            onScroll={this.handleScroll}
            keyboardShouldPersistTaps="handled"
          >
            {this.getCategories().map((category, i) => (
              <Category
                ref={this.setCategoryRef.bind(this, `category-${i}`)}
                key={category.name}
                id={category.id}
                name={category.name}
                emojis={category.emojis}
                perLine={perLine}
                native={native}
                data={this.data}
                i18n={this.i18n}
                recent={
                  category.id == this.RECENT_CATEGORY.id ? recent : undefined
                }
                custom={
                  category.id == this.RECENT_CATEGORY.id
                    ? this.CUSTOM_CATEGORY.emojis
                    : undefined
                }
                emojiProps={{
                  native,
                  skin,
                  size: emojiSize,
                  margin: emojiMargin,
                  set,
                  forceSize: native,
                  tooltip: emojiTooltip,
                  emojiImageFn,
                  useLocalImages,
                  onPress: this.handleEmojiPress,
                  onLongPress: this.handleEmojiLongPress,
                }}
              />
            ))}
          </ScrollView>
        </View>

        {showAnchors ? (
          <View style={styles.emojiMartAnchors}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Anchors
                ref={this.setAnchorsRef}
                data={this.data}
                i18n={this.i18n}
                color={color}
                categories={this.categories}
                onAnchorPress={this.handleAnchorPress}
                categoryEmojis={categoryEmojis}
                emojiProps={{
                  native,
                  skin,
                  size: anchorSize,
                  set,
                  forceSize: native,
                  emojiImageFn,
                  useLocalImages,
                }}
              />
            </ScrollView>
          </View>
        ) : null}
      </View>
    )
  }
}
