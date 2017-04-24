import React from 'react'
import emojiIndex from '../utils/emoji-index'

function rtrim(str,s) {
    if (s == undefined)
        s = '\\s';
    return str.replace(new RegExp("[" + s + "]*$"), '');
}
function ltrim(str,s) {
    if (s == undefined)
        s = '\\s';
    return str.replace(new RegExp("^[" + s + "]*"), '');
}

export default class Search extends React.Component {
  constructor(props){
    super(props);
    if(props.newdata){
      emojiIndex.updateData(this.props.newdata);
    }
    this.state = {
      placeholder : null
    };
  }
  handleChange() {
    var { input } = this.refs,
        value = input.value;

    value = ltrim(rtrim(value,':'),':');
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
    var { i18n, autoFocus } = this.props;

    return <input
      ref='input'
      type='text'
      onChange={this.handleChange.bind(this)}
      placeholder={(this.state.placeholder) ? this.state.placeholder : i18n.search }
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
