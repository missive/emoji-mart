import React from 'react'
import ReactDOM from 'react-dom'

import { Picker, Emoji } from '../src'

const CUSTOM_EMOJIS = [
  {
    name: 'Party Parrot',
    short_names: ['parrot'],
    keywords: ['party'],
    imageUrl: './images/parrot.gif'
  },
  {
    name: 'Octocat',
    short_names: ['octocat'],
    keywords: ['github'],
    imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/octocat.png?v7'
  },
  {
    name: 'Squirrel',
    short_names: ['shipit', 'squirrel'],
    keywords: ['github'],
    imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/shipit.png?v7'
  },
]

class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      native: true,
      set: 'apple',
      emoji: 'point_up',
      title: 'Pick your emoji…',
      custom: CUSTOM_EMOJIS,
    }
  }

  render() {
    return <div>
      <div className="row">
        <h1>Emoji Mart 🏬</h1>
      </div>

      <div className="row">
        {['native', 'apple', 'google', 'twitter', 'emojione', 'messenger', 'facebook'].map((set) => {
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
        <Picker
          {...this.state}
          onSelect={console.log}
        />
      </div>

      <div className="row-small">
        <iframe
          src='https://ghbtns.com/github-btn.html?user=missive&repo=emoji-mart&type=star&count=true'
          frameBorder='0'
          scrolling='0'
          width='90px'
          height='20px'
        ></iframe>
      </div>
    </div>
  }
}

ReactDOM.render(<Example />, document.querySelector('div'))
