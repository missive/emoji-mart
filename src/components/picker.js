import '../vendor/raf-polyfill'

import React from 'react'
import PropTypes from 'prop-types';

import data from '../../data'

import store from '../utils/store'
import frequently from '../utils/frequently'
import { deepMerge } from '../utils'

import { Anchors, Category, Emoji, Search ,Skins} from '.'
import { Scrollbars } from 'react-custom-scrollbars';


const RECENT_CATEGORY = { name: 'Recent', emojis: null }
const SEARCH_CATEGORY = { name: 'Search', emojis: null, anchor: false }

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
  },
}

export default class Picker extends React.Component {
  constructor(props) {
    super(props)

    this.newdata = null;

    this.addCustomData(data);

    this.i18n = deepMerge(I18N, props.i18n)
    this.state = {
      skin: store.get('skin') || props.skin,
      firstRender: true,
    }
  }
  initializeCategories(){
    let props = this.props;
    this.categories = []

    if (props.include != undefined) {
      data.categories.sort((a, b) => {
        let aName = a.name.toLowerCase()
        let bName = b.name.toLowerCase()

        if (props.include.indexOf(aName) > props.include.indexOf(bName)) {
          return 1
        }

        return 0
      })
    }

    for (let category of data.categories) {
      let isIncluded = props.include == undefined ? true : props.include.indexOf(category.name.toLowerCase()) > -1
      let isExcluded = props.exclude == undefined ? false : props.exclude.indexOf(category.name.toLowerCase()) > -1
      if (!isIncluded || isExcluded) { continue }

      if (props.emojisToShowFilter) {
        let newEmojis = []

        for (let emoji of category.emojis) {
          let unified = data.emojis[emoji].unified

          if (props.emojisToShowFilter(unified)) {
            newEmojis.push(emoji)
          }
        }

        if (newEmojis.length) {
          let newCategory = {
            emojis: newEmojis,
            name: category.name,
          }

          this.categories.push(newCategory)
        }
      } else {
        this.categories.push(category)
      }
    }

    let includeRecent = props.include == undefined ? true : props.include.indexOf('recent') > -1
    let excludeRecent = props.exclude == undefined ? false : props.exclude.indexOf('recent') > -1
    if (includeRecent && !excludeRecent) {
      this.categories.unshift(RECENT_CATEGORY)
    }

    if (this.categories[0]) {
      this.categories[0].first = true
    }
    this.categories.unshift(SEARCH_CATEGORY)
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
      this.setState({emojis_src : data.globalEmojiSrc });
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
    var { search } = this.refs
    search.setState({placeholder : emoji.colons })
    clearTimeout(this.leaveTimeout)
  }

  handleEmojiLeave(emoji) {
    this.leaveTimeout = setTimeout(() => {
      var { search } = this.refs
      search.setState({placeholder : null })
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
        scrollTop = target.viewScrollTop,
        scrollingDown = scrollTop > (this.viewScrollTop || 0),
        activeCategory = null,
        minTop = 0

    for (let i = 0, l = this.categories.length; i < l; i++) {
      let ii = scrollingDown ? (this.categories.length - 1 - i) : i,
          category = this.categories[ii],
          component = this.refs[`category-${ii}`]

      if (component) {
        let active = component.handleScroll(scrollTop)

        if (!minTop || component.top < minTop) {
          if (component.top > 0) {
            minTop = component.top
          }
        }

        if (active && !activeCategory) {
          activeCategory = category
        }
      }
    }

    if (scrollTop < minTop) {
      for (let category of this.categories) {
        if (category.anchor === false) { continue }

        activeCategory = category
        break
      }
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
    SEARCH_CATEGORY.emojis = emojis;
    console.log(SEARCH_CATEGORY);
    for (let i = 0, l = this.categories.length; i < l; i++) {
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

        if (category.first) {
          top = 0
        } else {
          top += 1
        }
        scroll.scrollTop(top)
        if(anchors && anchors.state && anchors.state.selected != category.name) {
          anchors.setState({ selected: category.name })
        }
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
    for (let i = 0, l = this.categories.length; i < l; i++) {
      let component = this.refs[`category-${i}`]
      if (component) component.memoizeSize()
    }
  }

  getCategories() {
    return this.state.firstRender ? this.categories.slice(0, 3) : this.categories
  }
 addCustomData(){
   let self = this;
   if(!self.props.emoji_custom){
     self.initializeCategories();
     return false;
   }
   let globalEmojiSrc = [];
   let emoji_propsA = self.props.emoji_custom;
   for(let ix=0;ix<emoji_propsA.length;ix++){
       let emoji_props = emoji_propsA[ix].emojis_obj;
       let emoji_custom_name = emoji_propsA[ix].name;

       let emoji_custom = this.formCustomEmojiObject(emoji_props);
       let new_emoji_custom=[],emoji_list;
       let eo = [];
       for(let i=0;i<data.categories.length;i++){
         eo.push(data.categories[i].emojis);
       }
       emoji_list = Array.prototype.concat.apply([], eo);

       let elist = [];
       let esrc = [];
       for(let i=0;i<emoji_custom.length;i++){
       	let a = self.nthize(emoji_custom[i].name,emoji_list);
        let es = emoji_custom[i].search.split(",");
            es.push(a);


         emoji_custom[i].name = a;
         emoji_custom[i].search = es.join(",");
         emoji_custom[i].short_names= [a];

         data.emojis[emoji_custom[i].name] = emoji_custom[i];
         emoji_list.push(a);
         elist.push(a);
         esrc[a] = emoji_custom[i].src;
         globalEmojiSrc[a] = emoji_custom[i].src;
       }
         let category_custom = {
           name : emoji_custom_name.split(" ").join("-")+'-'+ix,
           title : emoji_custom_name,
           emojis : elist,
           custom : true,
           emojis_src : esrc,
           anchor : false
         };
         data.categories.unshift(category_custom);
     }
   data.globalEmojiSrc = globalEmojiSrc;
   this.newdata = data;
   self.initializeCategories();
 }

 nthize(element,array){
 	let separator = "-";
   for(let i= 0;i<array.length;i++){
   	let current = array[i];

   if(current.indexOf(element) == 0){
       let exploded_str = current.split(separator);
       if(!exploded_str[1]){
       	element = exploded_str[0] + separator + 1;
       }else if(!isNaN(parseInt(exploded_str[1])) ){
 				element = exploded_str[0] + separator + (parseInt(exploded_str[1]) + 1);
       }
     }
   }
   return element;
 }
 formCustomEmojiObject(emoji_props){
    let emoji_custom = [];
     for(let i =0;i<emoji_props.length;i++){
         let eo = emoji_props[i];
         emoji_custom.push({
          name : eo.name,
          short_names : [eo.name],
          search : eo.name,
          src : eo.src,
          custom : true,
          emoticons : [],
          variation : [],
          has_img_apple : false,
          has_img_emojione : false,
          has_img_google : false,
          has_img_twitter : false
        });
     }
     return emoji_custom;
 }
  render() {
    var self = this;
    var { perLine, emojiSize, set, sheetSize, style, title, emoji, color, native, backgroundImageFn, emojisToShowFilter, include, exclude, autoFocus } = this.props,
        { skin } = this.state,
        width = (perLine * (emojiSize + 12)) + 12 + 2

    return <div style={{width: width, ...style}} className='emoji-mart'>

      <div className={'emoji-mart-flexer-container'}>
        <Search
          ref='search'
          onSearch={this.handleSearch.bind(this)}
          i18n={this.i18n}
          emojisToShowFilter={emojisToShowFilter}
          include={include}
          exclude={exclude}
          autoFocus={autoFocus}
          newdata={this.newdata}z
        />
        <Skins
            skin={skin}
            onChange={this.handleSkinChange.bind(this)}
        />
    </div>


  <Scrollbars ref="scroll" className="emoji-mart-scroll" onScroll={this.handleScroll.bind(this)}  style={{height:225}} autoHide={true}>
        {(!this.props.emoji_custom || this.state.emojis_src) ? this.renderCategory() : null}
  </Scrollbars>


  <div className='emoji-mart-bar'>
    <Anchors
      ref='anchors'
      i18n={this.i18n}
      color={color}
      categories={this.categories}
      onAnchorClick={this.handleAnchorClick.bind(this)}
    />
  </div>
    </div>
  }

renderCategory(){
  var self = this;
  var { perLine, emojiSize, set, sheetSize, style, title, emoji, color, native, backgroundImageFn, emojisToShowFilter, include, exclude, autoFocus } = this.props,
      { skin } = this.state;
  return(
  <div className="inner-mart-scroll">
    {this.getCategories().map((category, i) => {

      return <Category
        ref={`category-${i}`}
        key={category.name}
        name={category.name}
        title={category.title}
        emojis={category.emojis}
        emojis_src={self.state.emojis_src}
        perLine={perLine}
        native={native}
        hasStickyPosition={this.hasStickyPosition}
        i18n={this.i18n}
        emojiProps={{
          native:(category.custom) ? null : native,
          skin: (category.custom) ? null : skin,
          size: emojiSize,
          set: (category.custom) ? null : set,
          custom: (category.custom) ? category.custom : false,
          sheetSize:(category.custom) ? null : sheetSize,
          forceSize: (category.custom) ? null : native,
          backgroundImageFn: backgroundImageFn,
          onOver: this.handleEmojiOver.bind(this),
          onLeave: this.handleEmojiLeave.bind(this),
          onClick: this.handleEmojiClick.bind(this),
        }}
      />
    })}
  </div> );
  }
}

Picker.propTypes = {
  onClick: PropTypes.func,
  perLine: PropTypes.number,
  emojiSize: PropTypes.number,
  i18n: PropTypes.object,
  style: PropTypes.object,
  title: PropTypes.string,
  emoji: PropTypes.string,
  color: PropTypes.string,
  set: Emoji.propTypes.set,
  skin: Emoji.propTypes.skin,
  native: PropTypes.bool,
  backgroundImageFn: Emoji.propTypes.backgroundImageFn,
  sheetSize: Emoji.propTypes.sheetSize,
  emojisToShowFilter: PropTypes.func,
  include: PropTypes.arrayOf(PropTypes.string),
  exclude: PropTypes.arrayOf(PropTypes.string),
  autoFocus: PropTypes.bool,
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
  emojisToShowFilter: null,
  autoFocus: false,
}
