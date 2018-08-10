import React from 'react'
import PropTypes from 'prop-types'

import { NimbleEmoji } from '.'

export default class Skins extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
    }
  }

  handleClick(e) {
    var skin = parseInt(e.currentTarget.getAttribute('data-skin'))
    var { onChange } = this.props

    if (!this.state.opened) {
      this.setState({ opened: true })
    } else {
      this.setState({ opened: false })
      if (skin != this.props.skin) {
        onChange(skin)
      }
    }
  }

  render() {
    return null
  }
}

Skins.propTypes = {
  onChange: PropTypes.func,
  skin: PropTypes.number.isRequired,
}

Skins.defaultProps = {
  onChange: () => {},
}
