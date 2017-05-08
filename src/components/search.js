import React from 'react'
import emojiIndex from '../utils/emoji-index'

export default class Search extends React.Component {
  handleChange() {
    var { input } = this.refs,
        value = input.value

    this.props.onSearch(emojiIndex.search(value, {
      emojisToShowFilter: this.props.emojisToShowFilter,
      maxResults: this.props.maxResults,
      include: this.props.include,
      exclude: this.props.exclude,
    }))
  }

  clear() {
    this.refs.input.value = ''
  }

  render() {
    var { i18n, autoFocus } = this.props

    return <input
      ref='input'
      type='text'
      onChange={this.handleChange.bind(this)}
      placeholder={i18n.search}
      className='emoji-mart-search'
      autoFocus={autoFocus}
    />
  }
}

Search.propTypes = {
  onSearch: React.PropTypes.func,
  maxResults: React.PropTypes.number,
  emojisToShowFilter: React.PropTypes.func,
  autoFocus: React.PropTypes.bool,
}

Search.defaultProps = {
  onSearch: (() => {}),
  maxResults: 75,
  emojisToShowFilter: null,
  autoFocus: false,
}
