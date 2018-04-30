import React from 'react'
import PropTypes from 'prop-types'

import NimbleEmojiIndex from '../utils/emoji-index/nimble-emoji-index'

export default class Search extends React.PureComponent {
  constructor(props) {
    super(props)

    this.data = props.data
    this.emojiIndex = new NimbleEmojiIndex(this.data)
    this.setRef = this.setRef.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange() {
    var value = this.input.value

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
    var { i18n, autoFocus } = this.props

    return (
      <div className="emoji-mart-search">
        <input
          ref={this.setRef}
          type="text"
          onChange={this.handleChange}
          placeholder={i18n.search}
          autoFocus={autoFocus}
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
