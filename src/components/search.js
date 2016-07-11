import React from 'react'
import {emojiIndex} from '../utils'

export default class Search extends React.Component {
  handleChange() {
    var { input } = this.refs,
        value = input.value

    this.props.onSearch(emojiIndex.search(value))
  }

  clear() {
    this.refs.input.value = ''
  }

  render() {
    return <input
      ref='input'
      type='text'
      onChange={this.handleChange.bind(this)}
      placeholder='Search'
      className='emoji-picker-search'
    />
  }
}

Search.propTypes = {
  onSearch: React.PropTypes.func,
  maxResults: React.PropTypes.number,
}

Search.defaultProps = {
  onSearch: (() => {}),
  maxResults: 75,
}
