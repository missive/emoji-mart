import React from 'react'
import emojiIndex from '../utils/emoji-index'

export default class Search extends React.Component {
  handleChange() {
    var { input } = this.refs,
        value = input.value

    this.props.onSearch(emojiIndex.search(value, this.props.emojisToShowFilter, this.props.maxResults))
  }

  clear() {
    this.refs.input.value = ''
  }

  render() {
    var { i18n } = this.props

    return <input
      ref='input'
      type='text'
      onChange={this.handleChange.bind(this)}
      placeholder={i18n.search}
      className='emoji-mart-search'
    />
  }
}

Search.propTypes = {
  onSearch: React.PropTypes.func,
  maxResults: React.PropTypes.number,
  emojisToShowFilter: React.PropTypes.func
}

Search.defaultProps = {
  onSearch: (() => {}),
  maxResults: 75,
  emojisToShowFilter: () => true
}
