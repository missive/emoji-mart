import React from 'react'
import lunr from 'lunr'

import data from '../../data'

export default class Search extends React.Component {
  constructor(props) {
    super(props)
    this.buildIndex()
  }

  buildIndex() {
    this.index = lunr(function() {
      this.pipeline.reset()

      this.field('short_name', { boost: 2 })
      this.field('name')

      this.ref('id')
    })

    for (let emoji in data.emojis) {
      let emojiData = data.emojis[emoji],
          { short_name, name } = emojiData

      this.index.add({
        id: short_name,
        short_name: this.tokenize(short_name),
        name: this.tokenize(name),
      })
    }
  }

  tokenize (string) {
    if (['-', '-1', '+', '+1'].indexOf(string) == 0) {
      return string.split('')
    }

    return string.split(/[-|_|\s]+/)
  }

  handleChange() {
    var { input } = this.refs,
        value = input.value,
        results = null

    if (value.length) {
      results = this.index.search(this.tokenize(value)).map((result) =>
        result.ref
      )
    }

    this.props.onSearch(results)
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
}

Search.defaultProps = {
  onSearch: (() => {}),
}
