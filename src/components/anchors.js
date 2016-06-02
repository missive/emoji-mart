import React from 'react'
import InlineSVG from 'svg-inline-react'

import Activity from '../svgs/activity.svg'
import Flags from '../svgs/flags.svg'
import Foods from '../svgs/foods.svg'
import Nature from '../svgs/nature.svg'
import Objects from '../svgs/objects.svg'
import People from '../svgs/people.svg'
import Places from '../svgs/places.svg'
import Recent from '../svgs/recent.svg'
import Symbols from '../svgs/symbols.svg'

var svgs = {
  Activity,
  Flags,
  Foods,
  Nature,
  Objects,
  People,
  Places,
  Recent,
  Symbols,
}

export default class Anchors extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: props.categories[0].name
    }
  }

  render() {
    var { categories } = this.props,
        { selected } = this.state

    return <div className='emoji-picker-anchors'>
      {categories.map((category, i) => {
        var { name } = category

        return <span key={name} className={`emoji-picker-anchor ${name == selected ? 'emoji-picker-anchor-selected' : ''}`}>
          <InlineSVG src={svgs[name]} />
          <span className='emoji-picker-anchor-bar'></span>
        </span>
      })}
    </div>
  }
}

Anchors.propTypes = {
  categories: React.PropTypes.array,
}

Anchors.defaultProps = {
  categories: [],
}
