import React from 'react'
import InlineSVG from 'svg-inline-react'

import * as SVGs from '../svgs'

export default class Anchors extends React.Component {
  constructor(props) {
    super(props)

    var defaultCategory = props.categories[0]
    if (defaultCategory.anchor) {
      defaultCategory = defaultCategory.anchor
    }

    this.state = {
      selected: defaultCategory.name
    }
  }

  render() {
    var { categories, onAnchorClick } = this.props,
        { selected } = this.state

    return <div className='emoji-picker-anchors'>
      {categories.map((category, i) => {
        var { name, anchor } = category

        if (anchor) {
          return null
        }

        return (
          <span
            key={name}
            title={name}
            onClick={() => onAnchorClick(category, i)}
            className={`emoji-picker-anchor ${name == selected ? 'emoji-picker-anchor-selected' : ''}`}
          >
            <InlineSVG src={SVGs[name]} />
            <span className='emoji-picker-anchor-bar'></span>
          </span>
        )
      })}
    </div>
  }
}

Anchors.propTypes = {
  categories: React.PropTypes.array,
  onAnchorClick: React.PropTypes.func,
}

Anchors.defaultProps = {
  categories: [],
  onAnchorClick: (() => {}),
}
