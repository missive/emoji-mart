import React from 'react'
import InlineSVG from 'svg-inline-react'

import * as SVGs from '../svgs'

export default class Anchors extends React.Component {
  constructor(props) {
    super(props)

    let defaultCategory = null
    for (let category of props.categories) {
      if (category.first) {
        defaultCategory = category
        break
      }
    }

    this.state = {
      selected: defaultCategory.name
    }
  }

  render() {
    var { categories, onAnchorClick, color, i18n } = this.props,
        { selected } = this.state

    return <div className='emoji-mart-anchors'>
      {categories.map((category, i) => {
        var { name, anchor } = category,
            isSelected = name == selected

        if (anchor === false) {
          return null
        }

        return (
          <span
            key={name}
            title={i18n.categories[name.toLowerCase()]}
            onClick={() => onAnchorClick(category, i)}
            className={`emoji-mart-anchor ${isSelected ? 'emoji-mart-anchor-selected' : ''}`}
            style={{ color: isSelected ? color : null }}
          >
            <InlineSVG src={SVGs[name]} />
            <span className='emoji-mart-anchor-bar' style={{ backgroundColor: color }}></span>
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
