import { render } from 'preact'

import { init } from '@config'
import { ShadowElement } from '@components/HTMLElement'
import { Picker, PickerStyles } from '.'

export default class PickerElement extends ShadowElement {
  constructor(props) {
    super(props, { styles: PickerStyles })
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
