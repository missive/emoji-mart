import React from 'react'
import PropTypes from 'prop-types'

import SVGs from '../svgs'

export default class Anchors extends React.PureComponent {
  constructor(props) {
    super(props)

    let defaultCategory = props.categories.filter(category => category.first)[0]

    this.state = {
      selected: defaultCategory.name,
    }

    this.handleClick = this.handleClick.bind(this)
  }

  getSVG(id) {
    this.SVGs || (this.SVGs = {})

    if (this.SVGs[id]) {
      return this.SVGs[id]
    } else {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
       ${SVGs[id]}
      </svg>`

      this.SVGs[id] = svg
      return svg
    }
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
          var { id, name, anchor } = category,
            isSelected = name == selected

          if (anchor === false) {
            return null
          }

          return (
            <span
              key={id}
              title={i18n.categories[id]}
              data-index={i}
              onClick={this.handleClick}
              className={`emoji-mart-anchor ${isSelected
                ? 'emoji-mart-anchor-selected'
                : ''}`}
              style={{ color: isSelected ? color : null }}
            >
              <div dangerouslySetInnerHTML={{ __html: this.getSVG(id) }} />
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
