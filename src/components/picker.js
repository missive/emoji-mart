import '../vendor/raf-polyfill'

import React from 'react'
import data from '../../data'

import store from '../utils/store'
import frequently from '../utils/frequently'
import { deepMerge } from '../utils'

import { Anchors, Category, Emoji, Preview, Search } from '.'

const RECENT_CATEGORY = { name: 'Recent', emojis: null }
const SEARCH_CATEGORY = { name: 'Search', emojis: null, anchor: RECENT_CATEGORY }

let CATEGORIES = [];

const I18N = {
  search: 'Search',
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
  },
}

export default class Picker extends React.Component {
  constructor(props) {
    super(props)

    this.i18n = deepMerge(I18N, props.i18n)
    this.state = {
      skin: store.get('skin') || props.skin,
      firstRender: true,
    }

    let filteredCategories = [];

    for (let hash of data.categories) {
      let isIncluded = props.include == undefined ? true : props.include.indexOf(hash.name) > -1
      let isExcluded = props.exclude == undefined ? false : props.exclude.indexOf(hash.name) > -1
      if (!isIncluded || isExcluded) { continue; }

      let new_emojis = [];
      for (let emoji of hash.emojis) {
        let unified = data.emojis[emoji].unified;
        if (props.emojisToShowFilter(unified)) {
          new_emojis.push(emoji)
        }
      }

      if (new_emojis.length) {
        let new_hash = {
          emojis: new_emojis,
          name: hash.name
        }
        filteredCategories.push(new_hash);
      }
    }
    CATEGORIES = [
      SEARCH_CATEGORY,
      RECENT_CATEGORY,
    ].concat(filteredCategories);

    this.categories = CATEGORIES;
  }

  componentWillReceiveProps(props) {
    if (props.skin && !store.get('skin')) {
      this.setState({ skin: props.skin })
    }
  }

  componentDidMount() {
    if (this.state.firstRender) {
      this.testStickyPosition()
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
    SEARCH_CATEGORY.emojis = null

    clearTimeout(this.leaveTimeout)
    clearTimeout(this.firstRenderTimeout)
  }

  testStickyPosition() {
    var stickyTestElement = document.createElement('div')
    for (let prefix of ['', '-webkit-', '-ms-', '-moz-', '-o-']) {
      stickyTestElement.style.position = `${prefix}sticky`
    }

    this.hasStickyPosition = !!stickyTestElement.style.position.length
  }

  handleEmojiOver(emoji) {
    var { preview } = this.refs
    preview.setState({ emoji: emoji })
    clearTimeout(this.leaveTimeout)
  }

  handleEmojiLeave(emoji) {
    this.leaveTimeout = setTimeout(() => {
      var { preview } = this.refs
      preview.setState({ emoji: null })
    }, 16)
  }

  handleEmojiClick(emoji, e) {
    this.props.onClick(emoji, e)
    frequently.add(emoji)

    var component = this.refs['category-1']
    if (component) {
      let maxMargin = component.maxMargin
      component.forceUpdate()

      window.requestAnimationFrame(() => {
        component.memoizeSize()
        if (maxMargin == component.maxMargin) return

        this.updateCategoriesSize()
        this.handleScrollPaint()

        if (SEARCH_CATEGORY.emojis) {
          component.updateDisplay('none')
        }
      })
    }
  }

  handleScroll() {
    if (!this.waitingForPaint) {
      this.waitingForPaint = true
      window.requestAnimationFrame(this.handleScrollPaint.bind(this))
    }
  }

  handleScrollPaint() {
    this.waitingForPaint = false

    if (!this.refs.scroll) {
      return
    }

    var target = this.refs.scroll,
        scrollTop = target.scrollTop,
        scrollingDown = scrollTop > (this.scrollTop || 0),
        activeCategory = null,
        minTop = 0

    for (let i = 0, l = CATEGORIES.length; i < l; i++) {
      let ii = scrollingDown ? (CATEGORIES.length - 1 - i) : i,
          category = CATEGORIES[ii],
          component = this.refs[`category-${ii}`]

      if (component) {
        let active = component.handleScroll(scrollTop)

        if (!minTop || component.top < minTop) {
          if (component.top > 0) {
            minTop = component.top
          }
        }

        if (active && !activeCategory) {
          if (category.anchor) category = category.anchor
          activeCategory = category
        }
      }
    }

    if (scrollTop < minTop) {
      activeCategory = RECENT_CATEGORY
    }

    if (activeCategory) {
      let { anchors } = this.refs,
          { name: categoryName } = activeCategory

      if (anchors.state.selected != categoryName) {
        anchors.setState({ selected: categoryName })
      }
    }

    this.scrollTop = scrollTop
  }

  handleSearch(emojis) {
    SEARCH_CATEGORY.emojis = emojis

    for (let i = 0, l = CATEGORIES.length; i < l; i++) {
      let component = this.refs[`category-${i}`]

      if (component && component.props.name != 'Search') {
        let display = emojis ? 'none' : 'inherit'
        component.updateDisplay(display)
      }
    }

    this.forceUpdate()
  }

  handleAnchorClick(category, i) {
    var component = this.refs[`category-${i}`],
        { scroll, anchors } = this.refs,
        scrollToComponent = null

    scrollToComponent = () => {
      if (component) {
        let { top } = component

        if (category.name == 'Recent') {
          top = 0
        } else {
          top += 1
        }

        scroll.scrollTop = top
      }
    }

    if (SEARCH_CATEGORY.emojis) {
      this.handleSearch(null)
      this.refs.search.clear()

      window.requestAnimationFrame(scrollToComponent)
    } else {
      scrollToComponent()
    }
  }

  handleSkinChange(skin) {
    var newState = { skin: skin }

    this.setState(newState)
    store.update(newState)
  }

  updateCategoriesSize() {
    for (let i = 0, l = CATEGORIES.length; i < l; i++) {
      let component = this.refs[`category-${i}`]
      if (component) component.memoizeSize()
    }
  }

  getCategories() {
    var categories = CATEGORIES

    return this.state.firstRender ? categories.slice(0, 3) : categories
  }

  render() {
    var { perLine, emojiSize, set, sheetSize, style, title, emoji, color, native, backgroundImageFn, emojisToShowFilter, autoFocus } = this.props,
        { skin } = this.state,
        width = (perLine * (emojiSize + 12)) + 12 + 2

    return <div style={{width: width, ...style}} className='emoji-mart'>
      <div className='emoji-mart-bar'>
        <Anchors
          ref='anchors'
          i18n={this.i18n}
          color={color}
          categories={CATEGORIES}
          onAnchorClick={this.handleAnchorClick.bind(this)}
        />
      </div>

      <div ref="scroll" className='emoji-mart-scroll' onScroll={this.handleScroll.bind(this)}>
        <Search
          ref='search'
          onSearch={this.handleSearch.bind(this)}
          i18n={this.i18n}
          emojisToShowFilter={emojisToShowFilter}
          autoFocus={autoFocus}
        />

        {this.getCategories().map((category, i) => {
          return <Category
            ref={`category-${i}`}
            key={category.name}
            name={category.name}
            emojis={category.emojis}
            perLine={perLine}
            native={native}
            hasStickyPosition={this.hasStickyPosition}
            i18n={this.i18n}
            emojiProps={{
              native: native,
              skin: skin,
              size: emojiSize,
              set: set,
              sheetSize: sheetSize,
              forceSize: native,
              backgroundImageFn: backgroundImageFn,
              onOver: this.handleEmojiOver.bind(this),
              onLeave: this.handleEmojiLeave.bind(this),
              onClick: this.handleEmojiClick.bind(this),
            }}
          />
        })}
      </div>

      <div className='emoji-mart-bar'>
        <Preview
          ref='preview'
          title={title}
          emoji={emoji}
          emojiProps={{
            native: native,
            size: 38,
            skin: skin,
            set: set,
            sheetSize: sheetSize,
            backgroundImageFn: backgroundImageFn,
          }}
          skinsProps={{
            skin: skin,
            onChange: this.handleSkinChange.bind(this)
          }}
        />
      </div>
    </div>
  }
}

Picker.propTypes = {
  onClick: React.PropTypes.func,
  perLine: React.PropTypes.number,
  emojiSize: React.PropTypes.number,
  i18n: React.PropTypes.object,
  style: React.PropTypes.object,
  title: React.PropTypes.string,
  emoji: React.PropTypes.string,
  color: React.PropTypes.string,
  set: Emoji.propTypes.set,
  skin: Emoji.propTypes.skin,
  native: React.PropTypes.bool,
  backgroundImageFn: Emoji.propTypes.backgroundImageFn,
  sheetSize: Emoji.propTypes.sheetSize,
  emojisToShowFilter: React.PropTypes.func,
  include: React.PropTypes.arrayOf(React.PropTypes.string),
  exclude: React.PropTypes.arrayOf(React.PropTypes.string),
  autoFocus: React.PropTypes.bool,
}

Picker.defaultProps = {
  onClick: (() => {}),
  emojiSize: 24,
  perLine: 9,
  i18n: {},
  style: {},
  title: 'Emoji Mart™',
  emoji: 'department_store',
  color: '#ae65c5',
  set: Emoji.defaultProps.set,
  skin: Emoji.defaultProps.skin,
  native: Emoji.defaultProps.native,
  sheetSize: Emoji.defaultProps.sheetSize,
  backgroundImageFn: Emoji.defaultProps.backgroundImageFn,
  emojisToShowFilter: (codePoint) => true,
  autoFocus: false,
}
