import { render } from 'preact'

import { init } from '@config'
import { Emoji } from '.'

export default class EmojiElement extends HTMLElement {
  constructor(props = {}) {
    super()
    this.props = props

    if (props.parent) {
      props.parent.appendChild(this)
    }
  }

  async connectedCallback() {
    const pickerProps = await init()
    const props = { ...pickerProps }
    props.id = this.getAttribute('id')
    props.set = this.getAttribute('set') || props.set
    props.size = this.getAttribute('size')
    props.fallback = this.getAttribute('fallback')
    props.shortcodes = this.getAttribute('shortcodes')

    render(<Emoji {...props} />, this)
  }
}

if (!customElements.get('em-emoji')) {
  customElements.define('em-emoji', EmojiElement)
}
