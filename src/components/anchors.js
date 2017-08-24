import React from 'react'
import PropTypes from 'prop-types'

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
            isSelected = name == selected,
            SVGElement = SVGs[name]

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
            <SVGElement />
            <span className='emoji-mart-anchor-bar' style={{ backgroundColor: color }}></span>
          </span>
        )
      })}
    </div>
  }
}

Anchors.propTypes = {
  categories: PropTypes.array,
  onAnchorClick: PropTypes.func,
}

Anchors.defaultProps = {
  categories: [],
  onAnchorClick: (() => {}),
}
