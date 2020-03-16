import React from 'react'
import ReactDOM from 'react-dom'

import { Picker, Emoji } from '../dist'

const CUSTOM_EMOJIS = [
  {
    name: 'Party Parrot',
    short_names: ['party_parrot'],
    keywords: ['party', 'parrot'],
    imageUrl: './images/parrot.gif',
  },
  {
    name: 'Octocat',
    short_names: ['octocat'],
    keywords: ['github'],
    imageUrl: 'https://github.githubassets.com/images/icons/emoji/octocat.png',
  },
  {
    name: 'Squirrel',
    short_names: ['shipit', 'squirrel'],
    keywords: ['github'],
    imageUrl: 'https://github.githubassets.com/images/icons/emoji/shipit.png',
  },
]

class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      native: true,
      set: 'apple',
      theme: 'auto',
      emoji: 'point_up',
      title: 'Pick your emoji…',
      custom: CUSTOM_EMOJIS,
      useButton: false,
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <h1>Emoji Mart 🏬</h1>
        </div>

        <div className="row sets">
          Set: 
          {['native', 'apple', 'google', 'twitter', 'facebook'].map((set) => {
            var props = {
              disabled: !this.state.native && set == this.state.set,
            }

            if (set == 'native' && this.state.native) {
              props.disabled = true
            }

            return (
              <button
                key={set}
                value={set}
                onClick={() => {
                  if (set == 'native') {
                    this.setState({ native: true })
                  } else {
                    this.setState({ set: set, native: false })
                  }
                }}
                {...props}
              >
                {set}
              </button>
            )
          })}
        </div>

        <div className="row-small sets">
          Theme: 
          {['auto', 'light', 'dark'].map((theme) => {
            return (
              <button
                key={theme}
                disabled={theme == this.state.theme}
                onClick={() => {
                  this.setState({ theme })
                }}
              >
                {theme}
              </button>
            )
          })}
        </div>

        <div className="row">
          <Picker {...this.state} onSelect={console.log} />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Example />, document.querySelector('#picker'))
