import React from 'react'
import PropTypes from 'prop-types'

export default class Skins extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      opened: false,
    }
  }

  handleClick(skin) {
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
    var { skin } = this.props,
        { opened } = this.state

    return <div>
      <div className={`emoji-mart-skin-swatches ${opened ? 'emoji-mart-skin-swatches-opened' : ''}`}>
        {/* Use Array.prototype.fill() when it is more widely supported. */}
        {[...Array(6)].map((_, i) => {
          var skinTone = i + 1,
              selected = skinTone == skin

          return <span key={`skin-tone-${skinTone}`} className={`emoji-mart-skin-swatch ${selected ? 'emoji-mart-skin-swatch-selected' : ''}`}>
            <span
              onClick={() => this.handleClick(skinTone)}
              className={`emoji-mart-skin emoji-mart-skin-tone-${skinTone}`}>
            </span>
          </span>
        })}
      </div>
    </div>
  }
}

Skins.propTypes = {
  onChange: PropTypes.func,
  skin: PropTypes.number.isRequired,
}

Skins.defaultProps = {
  onChange: (() => {}),
}
