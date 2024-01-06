// @ts-nocheck
import { Component, createRef } from 'preact'

import { deepEqual, sleep, getEmojiData } from '../../utils'
import { Data, I18n, init } from '../../config'
import { SearchIndex, Store, FrequentlyUsed } from '../../helpers'
import Icons from '../../icons'

import { Emoji } from '../Emoji'
import { Navigation } from '../Navigation'
import { PureInlineComponent } from '../HOCs'

const Performance = {
  rowsPerRender: 10,
}

export default class Picker extends Component {
  constructor(props) {
    super()

    this.observers = []

    this.state = {
      pos: [-1, -1],
      perLine: this.initDynamicPerLine(props),
      visibleRows: { 0: true },
      ...this.getInitialState(props),
    }
  }

  getInitialState(props = this.props) {
    return {
      skin: Store.get('skin') || props.skin,
      theme: this.initTheme(props.theme),
    }
  }

  componentWillMount() {
    this.dir = I18n.rtl ? 'rtl' : 'ltr'
    this.refs = {
      menu: createRef(),
      navigation: createRef(),
      scroll: createRef(),
      search: createRef(),
      searchInput: createRef(),
      skinToneButton: createRef(),
      skinToneRadio: createRef(),
    }

    this.initGrid()

    if (
      this.props.stickySearch == false &&
      this.props.searchPosition == 'sticky'
    ) {
      console.warn(
        '[EmojiMart] Deprecation warning: `stickySearch` has been renamed `searchPosition`.',
      )

      this.props.searchPosition = 'static'
    }
  }

  componentDidMount() {
    this.register()

    this.shadowRoot = this.base.parentNode

    if (this.props.autoFocus) {
      const { searchInput } = this.refs
      if (searchInput.current) {
        searchInput.current.focus()
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.nextState || (this.nextState = {})

    for (const k in nextProps) {
      this.nextState[k] = nextProps[k]
    }

    clearTimeout(this.nextStateTimer)
    this.nextStateTimer = setTimeout(() => {
      let requiresGridReset = false

      for (const k in this.nextState) {
        this.props[k] = this.nextState[k]

        if (k === 'custom' || k === 'categories') {
          requiresGridReset = true
        }
      }

      delete this.nextState
      const nextState = this.getInitialState()

      if (requiresGridReset) {
        return this.reset(nextState)
      }

      this.setState(nextState)
    })
  }

  componentWillUnmount() {
    this.unregister()
  }

  async reset(nextState = {}) {
    await init(this.props)

    this.initGrid()
    this.unobserve()

    this.setState(nextState, () => {
      this.observeCategories()
      this.observeRows()
    })
  }

  register() {
    document.addEventListener('click', this.handleClickOutside)
    this.observe()
  }

  unregister() {
    document.removeEventListener('click', this.handleClickOutside)
    this.darkMedia?.removeEventListener('change', this.darkMediaCallback)
    this.unobserve()
  }

  observe() {
    this.observeCategories()
    this.observeRows()
  }

  unobserve({ except = [] } = {}) {
    if (!Array.isArray(except)) {
      except = [except]
    }

    for (const observer of this.observers) {
      if (except.includes(observer)) continue
      observer.disconnect()
    }

    this.observers = [].concat(except)
  }

  initGrid() {
    const { categories } = Data

    this.refs.categories = new Map()

    const navKey = Data.categories.map((category) => category.id).join(',')
    if (this.navKey && this.navKey != navKey) {
      this.refs.scroll.current && (this.refs.scroll.current.scrollTop = 0)
    }
    this.navKey = navKey

    this.grid = []
    this.grid.setsize = 0

    const addRow = (rows, category) => {
      const row = []
      row.__categoryId = category.id
      row.__index = rows.length
      this.grid.push(row)

      const rowIndex = this.grid.length - 1
      const rowRef = rowIndex % Performance.rowsPerRender ? {} : createRef()
      rowRef.index = rowIndex
      rowRef.posinset = this.grid.setsize + 1
      rows.push(rowRef)

      return row
    }

    for (let category of categories) {
      const rows = []
      let row = addRow(rows, category)

      for (let emoji of category.emojis) {
        if (row.length == this.getPerLine()) {
          row = addRow(rows, category)
        }

        this.grid.setsize += 1
        row.push(emoji)
      }

      this.refs.categories.set(category.id, { root: createRef(), rows })
    }
  }

  darkMediaCallback = () => {
    if (this.props.theme != 'auto') return
    this.setState({ theme: this.darkMedia.matches ? 'dark' : 'light' })
  }

  initTheme(theme) {
    if (theme != 'auto') return theme

    if (!this.darkMedia) {
      this.darkMedia = matchMedia('(prefers-color-scheme: dark)')
      if (this.darkMedia.media.match(/^not/)) return 'light'

      this.darkMedia.addEventListener('change', this.darkMediaCallback)
    }

    return this.darkMedia.matches ? 'dark' : 'light'
  }

  handleClickOutside = (e) => {
    const { element } = this.props

    if (e.target != element) {
      if (this.state.showSkins) {
        this.closeSkins()
      }

      if (this.props.onClickOutside) {
        this.props.onClickOutside(e)
      }
    }
  }

  handleBaseClick = (e) => {
    if (!this.state.showSkins) return
    if (!e.target.closest('.menu')) {
      e.preventDefault()
      e.stopImmediatePropagation()

      this.closeSkins()
    }
  }

  handleBaseKeydown = (e) => {
    if (!this.state.showSkins) return
    if (e.key == 'Escape') {
      e.preventDefault()
      e.stopImmediatePropagation()

      this.closeSkins()
    }
  }

  initDynamicPerLine(props = this.props) {
    if (!props.dynamicWidth) return
    const { element, emojiButtonSize } = props

    const calculatePerLine = () => {
      const { width } = element.getBoundingClientRect()
      return Math.floor(width / emojiButtonSize)
    }

    const observer = new ResizeObserver(() => {
      this.unobserve({ except: observer })
      this.setState({ perLine: calculatePerLine() }, () => {
        this.initGrid()
        this.forceUpdate(() => {
          this.observeCategories()
          this.observeRows()
        })
      })
    })

    observer.observe(element)
    this.observers.push(observer)

    return calculatePerLine()
  }

  getPerLine() {
    return this.state.perLine || this.props.perLine
  }

  getEmojiByPos([p1, p2]) {
    const grid = this.state.searchResults || this.grid
    const emoji = grid[p1] && grid[p1][p2]

    if (!emoji) return
    return SearchIndex.get(emoji)
  }

  observeCategories() {
    const navigation = this.refs.navigation.current
    if (!navigation) return

    const visibleCategories = new Map()
    const setFocusedCategory = (categoryId) => {
      if (categoryId != navigation.state.categoryId) {
        navigation.setState({ categoryId })
      }
    }

    const observerOptions = {
      root: this.refs.scroll.current,
      threshold: [0.0, 1.0],
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const id = entry.target.dataset.id
        visibleCategories.set(id, entry.intersectionRatio)
      }

      const ratios = [...visibleCategories]
      for (const [id, ratio] of ratios) {
        if (ratio) {
          setFocusedCategory(id)
          break
        }
      }
    }, observerOptions)

    for (const { root } of this.refs.categories.values()) {
      observer.observe(root.current)
    }

    this.observers.push(observer)
  }

  observeRows() {
    const visibleRows = { ...this.state.visibleRows }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = parseInt(entry.target.dataset.index)

          if (entry.isIntersecting) {
            visibleRows[index] = true
          } else {
            delete visibleRows[index]
          }
        }

        this.setState({ visibleRows })
      },
      {
        root: this.refs.scroll.current,
        rootMargin: `${
          this.props.emojiButtonSize * (Performance.rowsPerRender + 5)
        }px 0px ${this.props.emojiButtonSize * Performance.rowsPerRender}px`,
      },
    )

    for (const { rows } of this.refs.categories.values()) {
      for (const row of rows) {
        if (row.current) {
          observer.observe(row.current)
        }
      }
    }

    this.observers.push(observer)
  }

  preventDefault(e) {
    e.preventDefault()
  }

  handleSearchClick = () => {
    const emoji = this.getEmojiByPos(this.state.pos)
    if (!emoji) return

    this.setState({ pos: [-1, -1] })
  }

  handleSearchInput = async () => {
    const input = this.refs.searchInput.current
    if (!input) return

    const { value } = input
    const searchResults = await SearchIndex.search(value)
    const afterRender = () => {
      if (!this.refs.scroll.current) return
      this.refs.scroll.current.scrollTop = 0
    }

    if (!searchResults) {
      return this.setState({ searchResults, pos: [-1, -1] }, afterRender)
    }

    const pos = input.selectionStart == input.value.length ? [0, 0] : [-1, -1]
    const grid = []
    grid.setsize = searchResults.length
    let row = null

    for (let emoji of searchResults) {
      if (!grid.length || row.length == this.getPerLine()) {
        row = []
        row.__categoryId = 'search'
        row.__index = grid.length
        grid.push(row)
      }

      row.push(emoji)
    }

    this.ignoreMouse()
    this.setState({ searchResults: grid, pos }, afterRender)
  }

  handleSearchKeyDown = (e) => {
    // const specialKey = e.altKey || e.ctrlKey || e.metaKey
    const input = e.currentTarget
    e.stopImmediatePropagation()

    switch (e.key) {
      case 'ArrowLeft':
        // if (specialKey) return
        // e.preventDefault()
        this.navigate({ e, input, left: true })
        break

      case 'ArrowRight':
        // if (specialKey) return
        // e.preventDefault()
        this.navigate({ e, input, right: true })
        break

      case 'ArrowUp':
        // if (specialKey) return
        // e.preventDefault()
        this.navigate({ e, input, up: true })
        break

      case 'ArrowDown':
        // if (specialKey) return
        // e.preventDefault()
        this.navigate({ e, input, down: true })
        break

      case 'Enter':
        e.preventDefault()
        this.handleEmojiClick({ e, pos: this.state.pos })
        break

      case 'Escape':
        e.preventDefault()
        if (this.state.searchResults) {
          this.clearSearch()
        } else {
          this.unfocusSearch()
        }
        break

      default:
        break
    }
  }

  clearSearch = () => {
    const input = this.refs.searchInput.current
    if (!input) return

    input.value = ''
    input.focus()

    this.handleSearchInput()
  }

  unfocusSearch() {
    const input = this.refs.searchInput.current
    if (!input) return

    input.blur()
  }

  navigate({ e, input, left, right, up, down }) {
    const grid = this.state.searchResults || this.grid
    if (!grid.length) return

    let [p1, p2] = this.state.pos

    const pos = (() => {
      if (p1 == 0) {
        if (p2 == 0 && !e.repeat && (left || up)) {
          return null
        }
      }

      if (p1 == -1) {
        if (
          !e.repeat &&
          (right || down) &&
          input.selectionStart == input.value.length
        ) {
          return [0, 0]
        }

        return null
      }

      if (left || right) {
        let row = grid[p1]
        const increment = left ? -1 : 1

        p2 += increment
        if (!row[p2]) {
          p1 += increment
          row = grid[p1]

          if (!row) {
            p1 = left ? 0 : grid.length - 1
            p2 = left ? 0 : grid[p1].length - 1

            return [p1, p2]
          }

          p2 = left ? row.length - 1 : 0
        }

        return [p1, p2]
      }

      if (up || down) {
        p1 += up ? -1 : 1
        const row = grid[p1]

        if (!row) {
          p1 = up ? 0 : grid.length - 1
          p2 = up ? 0 : grid[p1].length - 1

          return [p1, p2]
        }

        if (!row[p2]) {
          p2 = row.length - 1
        }

        return [p1, p2]
      }
    })()

    if (pos) {
      e.preventDefault()
    } else {
      if (this.state.pos[0] > -1) {
        this.setState({ pos: [-1, -1] })
      }

      return
    }

    this.setState({ pos, keyboard: true }, () => {
      this.scrollTo({ row: pos[0] })
    })
  }

  scrollTo({ categoryId, row }) {
    const grid = this.state.searchResults || this.grid
    if (!grid.length) return

    const scroll = this.refs.scroll.current
    const scrollRect = scroll.getBoundingClientRect()

    let scrollTop = 0

    if (row >= 0) {
      categoryId = grid[row].__categoryId
    }

    if (categoryId) {
      const ref =
        this.refs[categoryId] || this.refs.categories.get(categoryId).root
      const categoryRect = ref.current.getBoundingClientRect()

      scrollTop = categoryRect.top - (scrollRect.top - scroll.scrollTop) + 1
    }

    if (row >= 0) {
      if (!row) {
        scrollTop = 0
      } else {
        const rowIndex = grid[row].__index
        const rowTop = scrollTop + rowIndex * this.props.emojiButtonSize
        const rowBot =
          rowTop +
          this.props.emojiButtonSize +
          this.props.emojiButtonSize * 0.88

        if (rowTop < scroll.scrollTop) {
          scrollTop = rowTop
        } else if (rowBot > scroll.scrollTop + scrollRect.height) {
          scrollTop = rowBot - scrollRect.height
        } else {
          return
        }
      }
    }

    this.ignoreMouse()
    scroll.scrollTop = scrollTop
  }

  ignoreMouse() {
    this.mouseIsIgnored = true
    clearTimeout(this.ignoreMouseTimer)
    this.ignoreMouseTimer = setTimeout(() => {
      delete this.mouseIsIgnored
    }, 100)
  }

  handleCategoryClick = ({ category, i }) => {
    this.scrollTo(i == 0 ? { row: -1 } : { categoryId: category.id })
  }

  handleEmojiOver(pos) {
    if (this.mouseIsIgnored || this.state.showSkins) return
    this.setState({ pos: pos || [-1, -1], keyboard: false })
  }

  handleEmojiClick({ e, emoji, pos }) {
    if (!this.props.onEmojiSelect) return

    if (!emoji && pos) {
      emoji = this.getEmojiByPos(pos)
    }

    if (emoji) {
      const emojiData = getEmojiData(emoji, { skinIndex: this.state.skin - 1 })

      if (this.props.maxFrequentRows) {
        FrequentlyUsed.add(emojiData, this.props)
      }

      this.props.onEmojiSelect(emojiData, e)
    }
  }

  openSkins = (e) => {
    const { currentTarget } = e
    const rect = currentTarget.getBoundingClientRect()

    this.setState({ showSkins: rect }, async () => {
      // Firefox requires 2 frames for the transition to consistenly work
      await sleep(2)

      const menu = this.refs.menu.current
      if (!menu) return

      menu.classList.remove('hidden')
      this.refs.skinToneRadio.current.focus()

      this.base.addEventListener('click', this.handleBaseClick, true)
      this.base.addEventListener('keydown', this.handleBaseKeydown, true)
    })
  }

  closeSkins() {
    if (!this.state.showSkins) return
    this.setState({ showSkins: null, tempSkin: null })

    this.base.removeEventListener('click', this.handleBaseClick)
    this.base.removeEventListener('keydown', this.handleBaseKeydown)
  }

  handleSkinMouseOver(tempSkin) {
    this.setState({ tempSkin })
  }

  handleSkinClick(skin) {
    this.ignoreMouse()
    this.closeSkins()

    this.setState({ skin, tempSkin: null })
    Store.set('skin', skin)
  }

  renderNav() {
    return (
      <Navigation
        key={this.navKey}
        ref={this.refs.navigation}
        icons={this.props.icons}
        theme={this.state.theme}
        dir={this.dir}
        unfocused={!!this.state.searchResults}
        position={this.props.navPosition}
        onClick={this.handleCategoryClick}
      />
    )
  }

  renderPreview() {
    const emoji = this.getEmojiByPos(this.state.pos)
    const noSearchResults =
      this.state.searchResults && !this.state.searchResults.length

    return (
      <div
        id="preview"
        class="flex flex-middle"
        dir={this.dir}
        data-position={this.props.previewPosition}
      >
        <div class="flex flex-middle flex-grow">
          <div
            class="flex flex-auto flex-middle flex-center"
            style={{
              height: this.props.emojiButtonSize,
              fontSize: this.props.emojiButtonSize,
            }}
          >
            <Emoji
              emoji={emoji}
              id={
                noSearchResults
                  ? this.props.noResultsEmoji || 'cry'
                  : this.props.previewEmoji ||
                    (this.props.previewPosition == 'top'
                      ? 'point_down'
                      : 'point_up')
              }
              set={this.props.set}
              size={this.props.emojiButtonSize}
              skin={this.state.tempSkin || this.state.skin}
              spritesheet={true}
              getSpritesheetURL={this.props.getSpritesheetURL}
            />
          </div>

          <div class={`margin-${this.dir[0]}`}>
            {emoji || noSearchResults ? (
              <div class={`padding-${this.dir[2]} align-${this.dir[0]}`}>
                <div class="preview-title ellipsis">
                  {emoji ? emoji.name : I18n.search_no_results_1}
                </div>
                <div class="preview-subtitle ellipsis color-c">
                  {emoji ? emoji.skins[0].shortcodes : I18n.search_no_results_2}
                </div>
              </div>
            ) : (
              <div class="preview-placeholder color-c">{I18n.pick}</div>
            )}
          </div>
        </div>

        {!emoji &&
          this.props.skinTonePosition == 'preview' &&
          this.renderSkinToneButton()}
      </div>
    )
  }

  renderEmojiButton(emoji, { pos, posinset, grid }) {
    const size = this.props.emojiButtonSize
    const skin = this.state.tempSkin || this.state.skin
    const emojiSkin = emoji.skins[skin - 1] || emoji.skins[0]
    const native = emojiSkin.native
    const selected = deepEqual(this.state.pos, pos)
    const key = pos.concat(emoji.id).join('')

    return (
      <PureInlineComponent key={key} {...{ selected, skin, size }}>
        <button
          aria-label={native}
          aria-selected={selected || undefined}
          aria-posinset={posinset}
          aria-setsize={grid.setsize}
          data-keyboard={this.state.keyboard}
          title={this.props.previewPosition == 'none' ? emoji.name : undefined}
          type="button"
          class="flex flex-center flex-middle"
          tabindex="-1"
          onClick={(e) => this.handleEmojiClick({ e, emoji })}
          onMouseEnter={() => this.handleEmojiOver(pos)}
          onMouseLeave={() => this.handleEmojiOver()}
          style={{
            width: this.props.emojiButtonSize,
            height: this.props.emojiButtonSize,
            fontSize: this.props.emojiSize,
            lineHeight: 0,
          }}
        >
          <div
            aria-hidden="true"
            class="background"
            style={{
              borderRadius: this.props.emojiButtonRadius,
              backgroundColor: this.props.emojiButtonColors
                ? this.props.emojiButtonColors[
                    (posinset - 1) % this.props.emojiButtonColors.length
                  ]
                : undefined,
            }}
          ></div>
          <Emoji
            emoji={emoji}
            set={this.props.set}
            size={this.props.emojiSize}
            skin={skin}
            spritesheet={true}
            getSpritesheetURL={this.props.getSpritesheetURL}
          />
        </button>
      </PureInlineComponent>
    )
  }

  renderSearch() {
    const renderSkinTone =
      this.props.previewPosition == 'none' ||
      this.props.skinTonePosition == 'search'

    return (
      <div>
        <div class="spacer"></div>
        <div class="flex flex-middle">
          <div class="search relative flex-grow">
            <input
              type="search"
              ref={this.refs.searchInput}
              placeholder={I18n.search}
              onClick={this.handleSearchClick}
              onInput={this.handleSearchInput}
              onKeyDown={this.handleSearchKeyDown}
              autoComplete="off"
            ></input>
            <span class="icon loupe flex">{Icons.search.loupe}</span>
            {this.state.searchResults && (
              <button
                title="Clear"
                aria-label="Clear"
                type="button"
                class="icon delete flex"
                onClick={this.clearSearch}
                onMouseDown={this.preventDefault}
              >
                {Icons.search.delete}
              </button>
            )}
          </div>

          {renderSkinTone && this.renderSkinToneButton()}
        </div>
      </div>
    )
  }

  renderSearchResults() {
    const { searchResults } = this.state
    if (!searchResults) return null

    return (
      <div class="category" ref={this.refs.search}>
        <div class={`sticky padding-small align-${this.dir[0]}`}>
          {I18n.categories.search}
        </div>
        <div>
          {!searchResults.length ? (
            <div class={`padding-small align-${this.dir[0]}`}>
              {this.props.onAddCustomEmoji && (
                <a onClick={this.props.onAddCustomEmoji}>{I18n.add_custom}</a>
              )}
            </div>
          ) : (
            searchResults.map((row, i) => {
              return (
                <div class="flex">
                  {row.map((emoji, ii) => {
                    return this.renderEmojiButton(emoji, {
                      pos: [i, ii],
                      posinset: i * this.props.perLine + ii + 1,
                      grid: searchResults,
                    })
                  })}
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  renderCategories() {
    const { categories } = Data
    const hidden = !!this.state.searchResults
    const perLine = this.getPerLine()

    return (
      <div
        style={{
          visibility: hidden ? 'hidden' : undefined,
          display: hidden ? 'none' : undefined,
          height: '100%',
        }}
      >
        {categories.map((category) => {
          const { root, rows } = this.refs.categories.get(category.id)

          return (
            <div
              data-id={category.target ? category.target.id : category.id}
              class="category"
              ref={root}
            >
              <div class={`sticky padding-small align-${this.dir[0]}`}>
                {category.name || I18n.categories[category.id]}
              </div>
              <div
                class="relative"
                style={{
                  height: rows.length * this.props.emojiButtonSize,
                }}
              >
                {rows.map((row, i) => {
                  const targetRow =
                    row.index - (row.index % Performance.rowsPerRender)
                  const visible = this.state.visibleRows[targetRow]
                  const ref = 'current' in row ? row : undefined

                  if (!visible && !ref) {
                    return null
                  }

                  const start = i * perLine
                  const end = start + perLine
                  const emojiIds = category.emojis.slice(start, end)

                  if (emojiIds.length < perLine) {
                    emojiIds.push(...new Array(perLine - emojiIds.length))
                  }

                  return (
                    <div
                      key={row.index}
                      data-index={row.index}
                      ref={ref}
                      class="flex row"
                      style={{ top: i * this.props.emojiButtonSize }}
                    >
                      {visible &&
                        emojiIds.map((emojiId, ii) => {
                          if (!emojiId) {
                            return (
                              <div
                                style={{
                                  width: this.props.emojiButtonSize,
                                  height: this.props.emojiButtonSize,
                                }}
                              ></div>
                            )
                          }

                          const emoji = SearchIndex.get(emojiId)

                          return this.renderEmojiButton(emoji, {
                            pos: [row.index, ii],
                            posinset: row.posinset + ii,
                            grid: this.grid,
                          })
                        })}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  renderSkinToneButton() {
    if (this.props.skinTonePosition == 'none') {
      return null
    }

    return (
      <div
        class="flex flex-auto flex-center flex-middle"
        style={{
          position: 'relative',
          width: this.props.emojiButtonSize,
          height: this.props.emojiButtonSize,
        }}
      >
        <button
          type="button"
          ref={this.refs.skinToneButton}
          class="skin-tone-button flex flex-auto flex-center flex-middle"
          aria-selected={this.state.showSkins ? '' : undefined}
          aria-label={I18n.skins.choose}
          title={I18n.skins.choose}
          onClick={this.openSkins}
          style={{
            width: this.props.emojiSize,
            height: this.props.emojiSize,
          }}
        >
          <span class={`skin-tone skin-tone-${this.state.skin}`}></span>
        </button>
      </div>
    )
  }

  renderLiveRegion() {
    const emoji = this.getEmojiByPos(this.state.pos)
    const contents = emoji ? emoji.name : ''

    return (
      <div aria-live="polite" class="sr-only">
        {contents}
      </div>
    )
  }

  renderSkins() {
    const skinToneButton = this.refs.skinToneButton.current
    const skinToneButtonRect = skinToneButton.getBoundingClientRect()
    const baseRect = this.base.getBoundingClientRect()

    const position = {}

    if (this.dir == 'ltr') {
      position.right = baseRect.right - skinToneButtonRect.right - 3
    } else {
      position.left = skinToneButtonRect.left - baseRect.left - 3
    }

    if (
      this.props.previewPosition == 'bottom' &&
      this.props.skinTonePosition == 'preview'
    ) {
      position.bottom = baseRect.bottom - skinToneButtonRect.top + 6
    } else {
      position.top = skinToneButtonRect.bottom - baseRect.top + 3
      position.bottom = 'auto'
    }

    return (
      <div
        ref={this.refs.menu}
        role="radiogroup"
        dir={this.dir}
        aria-label={I18n.skins.choose}
        class="menu hidden"
        data-position={position.top ? 'top' : 'bottom'}
        style={position}
      >
        {[...Array(6).keys()].map((i) => {
          const skin = i + 1
          const checked = this.state.skin == skin

          return (
            <div>
              <input
                type="radio"
                name="skin-tone"
                value={skin}
                aria-label={I18n.skins[skin]}
                ref={checked ? this.refs.skinToneRadio : null}
                defaultChecked={checked}
                onChange={() => this.handleSkinMouseOver(skin)}
                onKeyDown={(e) => {
                  if (
                    e.code == 'Enter' ||
                    e.code == 'Space' ||
                    e.code == 'Tab'
                  ) {
                    e.preventDefault()
                    this.handleSkinClick(skin)
                  }
                }}
              ></input>

              <button
                aria-hidden="true"
                tabindex="-1"
                onClick={() => this.handleSkinClick(skin)}
                onMouseEnter={() => this.handleSkinMouseOver(skin)}
                onMouseLeave={() => this.handleSkinMouseOver()}
                class="option flex flex-grow flex-middle"
              >
                <span class={`skin-tone skin-tone-${skin}`}></span>
                <span class="margin-small-lr">{I18n.skins[skin]}</span>
              </button>
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    const lineWidth = this.props.perLine * this.props.emojiButtonSize

    return (
      <section
        id="root"
        class="flex flex-column"
        dir={this.dir}
        style={{
          width: this.props.dynamicWidth
            ? '100%'
            : `calc(${lineWidth}px + (var(--padding) + var(--sidebar-width)))`,
        }}
        data-emoji-set={this.props.set}
        data-theme={this.state.theme}
        data-menu={this.state.showSkins ? '' : undefined}
      >
        {this.props.previewPosition == 'top' && this.renderPreview()}
        {this.props.navPosition == 'top' && this.renderNav()}
        {this.props.searchPosition == 'sticky' && (
          <div class="padding-lr">{this.renderSearch()}</div>
        )}

        <div ref={this.refs.scroll} class="scroll flex-grow padding-lr">
          <div
            style={{
              width: this.props.dynamicWidth ? '100%' : lineWidth,
              height: '100%',
            }}
          >
            {this.props.searchPosition == 'static' && this.renderSearch()}
            {this.renderSearchResults()}
            {this.renderCategories()}
          </div>
        </div>

        {this.props.navPosition == 'bottom' && this.renderNav()}
        {this.props.previewPosition == 'bottom' && this.renderPreview()}
        {this.state.showSkins && this.renderSkins()}
        {this.renderLiveRegion()}
      </section>
    )
  }
}
