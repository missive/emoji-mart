import { render } from 'preact'

import { init, getProps } from '../../config'
import { ShadowElement } from '../HTMLElement'
import { Picker, PickerStyles } from '.'
import PickerProps from './PickerProps'

export default class PickerElement extends ShadowElement {
  static Props = PickerProps

  constructor(props) {
    super(props, { styles: PickerStyles })
  }

  async connectedCallback() {
    const props = getProps(this.props, PickerProps, this)
    props.element = this
    props.ref = (component) => {
      this.component = component
    }

    await init(props)
    render(<Picker {...props} />, this.shadowRoot)
  }

  disconnectedCallback() {
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
