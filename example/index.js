import React from 'react'
import ReactDOM from 'react-dom'

import { Picker, Emoji } from '../src'

class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      emojiSize: 24,
      perLine: 9,
      skin: 1,
      native: true,
      set: 'apple',
      hidden: false,
      currentEmoji: 'thumbsup',
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
      <div>
        <h1 className='demo-title'>Emoji Mart</h1>

        <iframe
          src='https://ghbtns.com/github-btn.html?user=missive&repo=emoji-mart&type=star&count=true'
          frameBorder='0'
          scrolling='0'
          width='170px'
          height='20px'
        ></iframe>
      </div>

      <div className="row">
        {['native', 'apple', 'google', 'twitter', 'emojione'].map((set) => {
          var props = { disabled: !this.state.native && set == this.state.set }

          if (set == 'native' && this.state.native) {
            props.disabled = true
          }

          return <button
            key={set}
            value={set}
            onClick={() => {
              if (set == 'native') {
                this.setState({ native: true })
              } else {
                this.setState({ set: set, native: false })
              }
            }}
            {...props}>
            {set}
          </button>
        })}
      </div>

      <div className="row">
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
<Operator>import</Operator> &#123;Picker&#125; <Operator>from</Operator> <String>'emoji-mart'</String>
<br />
<br /><Operator>&lt;</Operator><Variable>Picker</Variable>
<br />  emojiSize<Operator>=</Operator>&#123;<Variable>{this.state.emojiSize}</Variable>&#125; <input type='range' data-key='emojiSize' onChange={this.handleInput.bind(this)} min='16' max='64' value={this.state.emojiSize} />
<br />  perLine<Operator>=</Operator>&#123;<Variable>{this.state.perLine}</Variable>&#125; {this.state.perLine < 10 ? '  ' : ' '} <input type='range' data-key='perLine' onChange={this.handleInput.bind(this)} min='7' max='16' value={this.state.perLine} />
<br />  skin<Operator>=</Operator>&#123;<Variable>{this.state.skin}</Variable>&#125;       <input type='range' data-key='skin' onChange={this.handleInput.bind(this)} min='1' max='6' value={this.state.skin} />
<br />  set<Operator>=</Operator><String>'{this.state.set}'</String>
<br />  onClick<Operator>=</Operator>&#123;(<Variable>emoji</Variable>) => console.log(<Variable>emoji</Variable>)&#125;
<br /><Operator>/&gt;</Operator>
      </pre>

      {!this.state.hidden &&
        <Picker
          emojiSize={this.state.emojiSize}
          perLine={this.state.perLine}
          skin={this.state.skin}
          native={this.state.native}
          set={this.state.set}
          onClick={(emoji) => {
            this.setState({ currentEmoji: emoji.id })
            console.log(emoji)
          }}
        />
      }

      <div>
        <pre style={{
          fontSize: 18,
          display: 'inline-block',
          verticalAlign: 'top',
          margin: '1em',
          width: '370px',
        }}>
<Operator>import</Operator> &#123;Emoji&#125; <Operator>from</Operator> <String>'emoji-mart'</String>
<br />
<br /><Operator>&lt;</Operator><Variable>Emoji</Variable>
<br />  emoji<Operator>=</Operator><String>'thumbsup'</String>
<br />  size<Operator>=</Operator>&#123;<Variable>{64}</Variable>&#125;
<br /><Operator>/&gt;</Operator>
        </pre>

        <span style={{ display: 'inline-block', marginTop: 60 }}>
          {Emoji({
            emoji: this.state.currentEmoji,
            size: 64,
            set: this.state.set,
          })}
        </span>
      </div>

      <div>
        <pre style={{
          fontSize: 18,
          display: 'inline-block',
          verticalAlign: 'top',
          margin: '1em',
          width: '370px',
        }}>
<br /><Operator>&lt;</Operator><Variable>Emoji</Variable>
<br />  emoji<Operator>=</Operator><String>':thumbsup:'</String>
<br />  size<Operator>=</Operator>&#123;<Variable>{64}</Variable>&#125;
<br /><Operator>/&gt;</Operator>
        </pre>

        <span style={{ display: 'inline-block', marginTop: 40 }}>
          {Emoji({
            emoji: `:${this.state.currentEmoji}:`,
            size: 64,
            set: this.state.set,
          })}
        </span>
      </div>

      <div>
        <pre style={{
          fontSize: 18,
          display: 'inline-block',
          verticalAlign: 'top',
          margin: '1em',
          width: '370px',
        }}>
  <br /><Operator>&lt;</Operator><Variable>Emoji</Variable>
  <br />  emoji<Operator>=</Operator><String>':thumbsup::skin-tone-3:'</String>
  <br />  size<Operator>=</Operator>&#123;<Variable>{64}</Variable>&#125;
  <br /><Operator>/&gt;</Operator>
        </pre>

        <span style={{ display: 'inline-block', marginTop: 40 }}>
          {Emoji({
            emoji: `:${this.state.currentEmoji}::skin-tone-3:`,
            size: 64,
            set: this.state.set,
          })}
        </span>
      </div>

      <div>
        <pre style={{
          fontSize: 18,
          display: 'inline-block',
          verticalAlign: 'top',
          margin: '1em',
          width: '370px',
        }}>
  <br /><Operator>&lt;</Operator><Variable>Emoji</Variable>
  <br />  emoji<Operator>=</Operator><String>':thumbsup::skin-tone-3:'</String>
  <br />  size<Operator>=</Operator>&#123;<Variable>{64}</Variable>&#125;
  <br />  native<Operator>=</Operator>&#123;<Variable>{'true'}</Variable>&#125;
  <br /><Operator>/&gt;</Operator>
        </pre>

        <span style={{ display: 'inline-block', marginTop: 60 }}>
          {Emoji({
            emoji: `:${this.state.currentEmoji}::skin-tone-3:`,
            size: 64,
            native: true,
          })}
        </span>
      </div>
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
