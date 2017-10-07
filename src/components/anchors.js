import React from 'react'
import PropTypes from 'prop-types'

import SVGs from '../svgs'

export default class Anchors extends React.PureComponent {
  constructor(props) {
    super(props)

    const { categories } = props

    const defaultCategory = categories.filter(category => category.first)[0]

    this.state = {
      selected: defaultCategory.name,
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    var index = e.currentTarget.getAttribute('data-index')
    var { categories, onAnchorClick } = this.props

    onAnchorClick(categories[index], index)
  }

  render() {
    var { categories, onAnchorClick, color, i18n } = this.props,
      { selected } = this.state

    return (
      <div className="emoji-mart-anchors">
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
              data-index={i}
              onClick={this.handleClick}
              className={`emoji-mart-anchor ${isSelected
                ? 'emoji-mart-anchor-selected'
                : ''}`}
              style={{ color: isSelected ? color : null }}
            >
              <div dangerouslySetInnerHTML={{ __html: SVGs[name] }} />
              <span
                className="emoji-mart-anchor-bar"
                style={{ backgroundColor: color }}
              />
            </span>
          )
        })}
      </div>
    )
  }
}

Anchors.propTypes = {
  categories: PropTypes.array,
  onAnchorClick: PropTypes.func,
}

Anchors.defaultProps = {
  categories: [],
  onAnchorClick: () => {},
}
