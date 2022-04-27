import { render } from 'preact'

import { init, getProps } from '../../config'
import { HTMLElement } from '../HTMLElement'
import EmojiProps from './EmojiProps'

export default class EmojiElement extends HTMLElement {
  static Props = EmojiProps

  constructor(props) {
    super(props)
  }

  async connectedCallback() {
    const props = getProps(this.props, EmojiProps, this)
    props.element = this
    props.ref = (component) => {
      this.component = component
    }

    await init()
    render(<Emoji {...props} />, this)
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('em-emoji')) {
  customElements.define('em-emoji', EmojiElement)
}
