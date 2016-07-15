import React from 'react'
import ReactDOM from 'react-dom'

import {Picker} from '../src'

class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      emojiSize: 24,
      perLine: 9,
      skin: 1,
      set: 'apple',
      hidden: false,
    }
  }

  handleInput(e) {
    var { currentTarget } = e,
        { value } = currentTarget,
        key = currentTarget.getAttribute('data-key'),
        state = {}

    state[key] = parseInt(value)
    this.setState(state)
  }

  render() {
    return <div>
      <h1>EmojiPicker</h1>

      <div>
        {['Apple', 'Google', 'Twitter', 'EmojiOne'].map((set) => {
          var value = set.toLowerCase(),
              props = { disabled: value == this.state.set }

          return <button
            key={value}
            value={value}
            onClick={() => this.setState({ set: value })}
            {...props}>
            {set}
          </button>
        })}
      </div>

      <div>
        <button
          onClick={() => this.setState({ hidden: !this.state.hidden })}
        >{this.state.hidden ? 'Mount' : 'Unmount'}</button>
      </div>

      <pre style={{
        fontSize: 18,
        display: 'inline-block',
        verticalAlign: 'top',
        margin: '1em',
        width: '460px',
      }}>
<Operator>import</Operator> &#123;Picker&#125; <Operator>from</Operator> <String>'emoji-picker'</String>
<br />
<br /><Operator>&lt;</Operator><Variable>Picker</Variable>
<br />  title<Operator>=</Operator><String>'EmojiPicker'</String>
<br />  emoji<Operator>=</Operator><String>'tophat'</String>
<br />  emojiSize<Operator>=</Operator>&#123;<Variable>{this.state.emojiSize}</Variable>&#125; <input type='range' data-key='emojiSize' onChange={this.handleInput.bind(this)} min='16' max='64' value={this.state.emojiSize} />
<br />  perLine<Operator>=</Operator>&#123;<Variable>{this.state.perLine}</Variable>&#125; {this.state.perLine < 10 ? '  ' : ' '} <input type='range' data-key='perLine' onChange={this.handleInput.bind(this)} min='7' max='16' value={this.state.perLine} />
<br />  skin<Operator>=</Operator>&#123;<Variable>{this.state.skin}</Variable>&#125;       <input type='range' data-key='skin' onChange={this.handleInput.bind(this)} min='1' max='6' value={this.state.skin} />
<br />  sheetURL<Operator>=</Operator><String>'sheets/sheet_{this.state.set}_64.png'</String>
<br />  onClick<Operator>=</Operator>&#123;(<Variable>emoji</Variable>) => console.log(<Variable>emoji</Variable>)&#125;
<br /><Operator>/&gt;</Operator>
      </pre>

      {!this.state.hidden &&
        <Picker
          emojiSize={this.state.emojiSize}
          perLine={this.state.perLine}
          skin={this.state.skin}
          sheetURL={`../sheets/sheet_${this.state.set}_64.png`}
          onClick={(emoji) => console.log(emoji)}
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
