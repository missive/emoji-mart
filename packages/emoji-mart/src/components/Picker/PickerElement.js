import { render } from 'preact'

import { init } from '../../config'
import { ShadowElement } from '../HTMLElement'
import { Picker, PickerStyles } from '.'

export default class PickerElement extends ShadowElement {
  constructor(props) {
    super(props, { styles: PickerStyles })
  }

  setComponent = (component) => {
    this.component = component
  }

  async connectedCallback() {
    const pickerProps = await init(this.props, this)
    if (this.disconnected) return

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
      ref: this.setComponent,
      onEmojiSelect,
      onClickOutside,
      onAddCustomEmoji,
      getImageURL,
      getSpritesheetURL,
    }

    render(<Picker {...props} />, this.shadowRoot)
  }

  disconnectedCallback() {
    this.disconnected = true

    if (this.component) {
      this.component.unregister()
    }
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('em-emoji-picker')
) {
  customElements.define('em-emoji-picker', PickerElement)
}
