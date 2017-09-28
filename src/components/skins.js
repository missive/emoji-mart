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
    const { skin } = this.props
    const { opened } = this.state

    const skinToneNodes = []

    for (let i = 0; i < 6; i++) {
      const skinTone = i + 1
      const selected = skinTone == skin

      skinToneNodes.push(
        <span
          key={`skin-tone-${skinTone}`}
          className={`emoji-mart-skin-swatch ${selected ? 'emoji-mart-skin-swatch-selected' : ''}`}
        >
          <span
            onClick={() => this.handleClick(skinTone)}
            className={`emoji-mart-skin emoji-mart-skin-tone-${skinTone}`}>
          </span>
        </span>
      )
    }

    return <div>
      <div className={`emoji-mart-skin-swatches ${opened ? 'emoji-mart-skin-swatches-opened' : ''}`}>
        {skinToneNodes}
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
