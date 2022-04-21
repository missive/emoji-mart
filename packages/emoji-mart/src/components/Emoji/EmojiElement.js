import { render } from 'preact'

import { init } from '@config'
import { Emoji } from '.'

export default class EmojiElement extends HTMLElement {
  constructor(props = {}) {
    super()
    this.props = props

    if (props.parent || props.ref) {
      const parent = props.parent || (props.ref && props.ref.current)
      if (parent) parent.appendChild(this)
    }
  }

  async connectedCallback() {
    const pickerProps = await init()

    const props = {
      ...pickerProps,
      id: this.getAttribute('id'),
      set: this.getAttribute('set') || pickerProps.set,
      size: this.getAttribute('size'),
      fallback: this.getAttribute('fallback'),
      shortcodes: this.getAttribute('shortcodes'),
    }

    render(<Emoji {...props} />, this)
  }
}

if (!customElements.get('em-emoji')) {
  customElements.define('em-emoji', EmojiElement)
}
