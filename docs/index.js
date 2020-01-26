import React from 'react'
import ReactDOM from 'react-dom'

import { Picker, Emoji } from '../src'

const CUSTOM_EMOJIS = [
  {
    name: 'Party Parrot',
    short_names: ['parrot'],
    keywords: ['party'],
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
  {
    name: 'Test Flag',
    short_names: ['test'],
    keywords: ['test', 'flag'],
    spriteUrl:
      'https://unpkg.com/emoji-datasource-twitter@4.0.4/img/twitter/sheets-256/64.png',
    sheet_x: 1,
    sheet_y: 1,
    size: 64,
    sheetColumns: 52,
    sheetRows: 52,
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
    return (
      <div>
        <div className="row">
          <h1>Emoji Mart 🏬</h1>
        </div>

        <div className="row sets">
          Set: 
          {[
            'native',
            'apple',
            'google',
            'twitter',
            'facebook',
          ].map((set) => {
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

          <button
            disabled={this.state.darkMode == undefined}
            onClick={() => {
              this.setState({ darkMode: undefined })
            }}
          >
            auto
          </button>

          <button
            disabled={this.state.darkMode == false}
            onClick={() => {
              this.setState({ darkMode: false })
            }}
          >
            light
          </button>

          <button
            disabled={this.state.darkMode}
            onClick={() => {
              this.setState({ darkMode: true })
            }}
          >
            dark
          </button>
        </div>

        <div className="row">
          <Picker {...this.state} onSelect={console.log} />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Example />, document.querySelector('#picker'))
