import React from 'react'
import PropTypes from 'prop-types'

import { search as icons } from '../svgs'
import NimbleEmojiIndex from '../utils/emoji-index/nimble-emoji-index'

export default class Search extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      icon: icons.search,
      isSearching: false,
    }

    this.data = props.data
    this.emojiIndex = new NimbleEmojiIndex(this.data)
    this.setRef = this.setRef.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.clear = this.clear.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  search(value) {
    if (value == '')
      this.setState({
        icon: icons.search,
        isSearching: false,
      })
    else
      this.setState({
        icon: icons.delete,
        isSearching: true,
      })

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

  clear() {
    if (this.input.value == '') return
    this.input.value = ''
    this.search('')
  }

  handleChange() {
    this.search(this.input.value)
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.clear()
    }
  }

  setRef(c) {
    this.input = c
  }

  render() {
    var { i18n, autoFocus } = this.props
    var { icon, isSearching } = this.state

    return (
      <div className="emoji-mart-search">
        <input
          ref={this.setRef}
          type="text"
          onChange={this.handleChange}
          placeholder={i18n.search}
          autoFocus={autoFocus}
        />
        <button
          className="emoji-mart-search-icon"
          onClick={this.clear}
          onKeyUp={this.handleKeyUp}
          disabled={!isSearching}
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      </div>
    )
  }
}

Search.propTypes = {
  onSearch: PropTypes.func,
  maxResults: PropTypes.number,
  emojisToShowFilter: PropTypes.func,
  autoFocus: PropTypes.bool,
}

Search.defaultProps = {
  onSearch: () => {},
  maxResults: 75,
  emojisToShowFilter: null,
  autoFocus: false,
}
