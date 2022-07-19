import { render } from 'preact'

import { init } from '../../config'
import { ShadowElement } from '../HTMLElement'
import { Picker, PickerStyles } from '.'

export default class PickerElement extends ShadowElement {
  constructor(props) {
    super(props, { styles: PickerStyles })
  }

  async connectedCallback() {
    const pickerProps = await init(this.props, this)
    const {
      onEmojiSelect,
      onClickOutside,
      onAddCustomEmoji,
      getImageURL,
      getSpritesheetURL,
    } = this.props

    const props = {
      ...pickerProps,
      element: this,
      onEmojiSelect,
      onClickOutside,
      onAddCustomEmoji,
      getImageURL,
      getSpritesheetURL,
    }

    render(<Picker {...props} />, this.shadowRoot)
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('em-emoji-picker')
) {
  customElements.define('em-emoji-picker', PickerElement)
}
