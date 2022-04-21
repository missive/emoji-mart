import { render } from 'preact'

import { init } from '@config'
import { Picker, PickerStyles } from '.'

export default class PickerElement extends HTMLElement {
  constructor(props = {}) {
    super()
    this.props = props

    this.setShadow()
    if (props.parent || props.ref) {
      const parent = props.parent || (props.ref && props.ref.current)
      if (parent) parent.appendChild(this)
    }
  }

  setShadow() {
    this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = PickerStyles

    this.shadowRoot.insertBefore(style, this.shadowRoot.firstChild)
  }

  async connectedCallback() {
    const pickerProps = await init(this.props, this)
    const { onEmojiSelect, onClickOutside, onAddCustomEmoji } = this.props

    const props = {
      ...pickerProps,
      element: this,
      onEmojiSelect,
      onClickOutside,
      onAddCustomEmoji,
    }

    render(<Picker {...props} />, this.shadowRoot)
  }
}

if (!customElements.get('em-emoji-picker')) {
  customElements.define('em-emoji-picker', PickerElement)
}
