import React from 'react'
import ReactDOM from 'react-dom'

import {  PickerButton,Emoji } from '../src'

class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      emojiSize: 24,
      perLine: 9,
      skin: 1,
      native: false,
      set: 'emojione',
      hidden: false,
      textarea : ""
    }
  }

  handleInput(e) {
    var { currentTarget } = e,
        { value, type, checked } = currentTarget,
        key = currentTarget.getAttribute('data-key'),
        state = {}

    if (type == 'checkbox') {
      state[key] = checked
    } else {
      state[key] = parseInt(value)
    }

    this.setState(state)
  }

  render() {
    return <div>
        <h1 className='demo-title'>Emoji Go</h1>

        <br />
          <textarea value={(this.state.textarea) ? this.state.textarea : '' } ></textarea>
        <br />
        <br />
        <br />
      {!this.state.hidden &&
        <PickerButton
          pickerProps={{
            emojiSize : this.state.emojiSize,
            perLine : this.state.perLine,
            skin : this.state.skin,
            native : this.state.native,
            set : this.state.set,
            onClick : (emoji) => this.setState({textarea : this.state.textarea + ' ' + emoji.colons + ' ' }) ,
            emoji_custom : [ {name: 'New World Order' ,emojis_obj : [{name : "ape_man",src : "https://cdn.discordapp.com/emojis/285668075846762496.png"},{name: "rowdy_gangbanger",src : "https://cdn.discordapp.com/emojis/276065442777268224.png" }]} ]
          }}
        />
      }  
    </div>
  }
}

class Operator extends React.Component {
  render() {
    return <span style={{color: '#a71d5d'}}>
      {this.props.children}
    </span>
  }
}

class Variable extends React.Component {
  render() {
    return <span style={{color: '#0086b3'}}>
      {this.props.children}
    </span>
  }
}

class String extends React.Component {
  render() {
    return <span style={{color: '#183691'}}>
      {this.props.children}
    </span>
  }
}

ReactDOM.render(<Example />, document.querySelector('div'))
