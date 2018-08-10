import React from 'react'
import PropTypes from 'prop-types'

import { Skins } from '.'

export default class SkinsDot extends Skins {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    const { skin, i18n } = this.props
    const { opened } = this.state
    const skinToneNodes = []

    for (let skinTone = 1; skinTone <= 6; skinTone++) {
      const selected = skinTone === skin
      skinToneNodes.push(
        <span
          key={`skin-tone-${skinTone}`}
          className={`emoji-mart-skin-swatch${selected ? ' selected' : ''}`}
        >
          <span
            onClick={this.handleClick}
            data-skin={skinTone}
            className={`emoji-mart-skin emoji-mart-skin-tone-${skinTone}`}
          />
        </span>,
      )
    }

    return (
      <div className={`emoji-mart-skin-swatches${opened ? ' opened' : ''}`}>
        {skinToneNodes}
      </div>
    )
  }
}

SkinsDot.propTypes = {
  onChange: PropTypes.func,
  skin: PropTypes.number.isRequired,
  i18n: PropTypes.object,
}

SkinsDot.defaultProps = {
  onChange: () => {},
}
