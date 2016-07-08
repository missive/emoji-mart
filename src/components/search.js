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
      this.field('emoticons')
      this.field('name')

      this.ref('id')
    })

    for (let emoji in data.emojis) {
      let emojiData = data.emojis[emoji],
          { short_name, name, emoticons } = emojiData

      this.index.add({
        id: short_name,
        emoticons: emoticons,
        short_name: this.tokenize(short_name),
        name: this.tokenize(name),
      })
    }
  }

  tokenize (string) {
    if (['-', '-1', '+', '+1'].indexOf(string) == 0) {
      return string.split('')
    }

    if (/(:|;|=)-/.test(string)) {
      return [string]
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

      results = results.slice(0, this.props.maxResults)
    }

    this.props.onSearch(results)
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
