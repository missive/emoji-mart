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

    // Do not set props.skin if the `native` attribute was used
    if (!emoji) {
      const skinString = this.getAttribute('skin')
      let skin = parseInt(skinString)

      if (!Number.isNaN(skin)) {
        props.skin = skin
      }
    }

    render(<Emoji {...props} />, this)
  }
}

if (!customElements.get('em-emoji')) {
  customElements.define('em-emoji', EmojiElement)
}
