import { render } from 'preact'

import { init } from '../../config'
import { SearchIndex } from '../../helpers'
import { HTMLElement } from '../HTMLElement'
import { Emoji } from '.'

export default class EmojiElement extends HTMLElement {
  async connectedCallback() {
    const pickerProps = await init()

    const native = this.getAttribute('native')
    let emoji = null
    if (native) {
      emoji = SearchIndex.get(native)
    }

    const props = {
      ...pickerProps,
      emoji: emoji,
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
