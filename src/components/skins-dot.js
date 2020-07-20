import React from 'react'
import PropTypes from 'prop-types'

import Skins from './skins'

export default class SkinsDot extends Skins {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleMenuClick = this.handleMenuClick.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleSkinKeyDown = this.handleSkinKeyDown.bind(this)
    this.setSkinTonesRef = this.setSkinTonesRef.bind(this)

    this.skinTones = null
  }

  handleMenuClick() {
    const { skin } = this.props
    const currentSkinEl = this.skinTones.querySelector(`[data-skin="${skin}"]`)
    currentSkinEl.focus()
    this.setState({ opened: !this.state.opened })
  }
  handleKeyDown(event) {
    if (event.keyCode === 13) {
      event.preventDefault()
      this.handleMenuClick(event)
    }
  }

  handleSkinKeyDown(event) {
    // if either enter or space is pressed, then execute
    if (event.keyCode === 13 || event.keyCode === 32) {
      event.preventDefault()
      this.handleClick(event)
    }
  }

  setSkinTonesRef(c) {
    this.skinTones = c
  }

  render() {
    const { skin, i18n } = this.props
    const { opened } = this.state
    const skinToneNodes = []

    for (let skinTone = 1; skinTone <= 6; skinTone++) {
      const selected = skinTone === skin
      const visible = opened || selected
      skinToneNodes.push(
        <span
          key={`skin-tone-${skinTone}`}
          className={`emoji-mart-skin-swatch${selected ? ' selected' : ''}`}
          aria-label={i18n.skintones[skinTone]}
          aria-hidden={!visible}
          {...(opened ? { role: 'menuitem' } : {})}
        >
          <span
            onClick={this.handleClick}
            onKeyDown={this.handleSkinKeyDown}
            tabIndex={opened ? '0' : ''}
            role="button"
            {...(selected
              ? {
                  'aria-haspopup': true,
                  'aria-expanded': !!opened,
                }
              : {})}
            {...(opened ? { 'aria-pressed': !!selected } : {})}
            aria-label={i18n.skintones[skinTone]}
            title={i18n.skintones[skinTone]}
            data-skin={skinTone}
            className={`emoji-mart-skin emoji-mart-skin-tone-${skinTone}`}
          />
        </span>,
      )
    }

    return (
      <section
        className={`emoji-mart-skin-swatches${opened ? ' opened' : ''}`}
        aria-label={i18n.skintext}
      >
        <div
          {...(opened ? { role: 'menubar' } : {})}
          tabIndex={opened ? '' : '0'}
          onClick={this.handleMenuClick}
          onKeyDown={this.handleKeyDown}
          ref={this.setSkinTonesRef}
        >
          {skinToneNodes}
        </div>
      </section>
    )
  }
}

SkinsDot.propTypes /* remove-proptypes */ = {
  onChange: PropTypes.func,
  skin: PropTypes.number.isRequired,
  i18n: PropTypes.object,
}

SkinsDot.defaultProps = {
  onChange: () => {},
}
