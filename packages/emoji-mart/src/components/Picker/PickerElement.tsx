// @ts-nocheck
import { render } from 'preact'

import { init, getProps } from '../../config'
import { ShadowElement } from '../HTMLElement'
import { Picker, PickerStyles } from '.'
import { defaultPickerProps, PickerProps } from './PickerProps'

export default class PickerElement extends ShadowElement {
  static Props = defaultPickerProps

  constructor(props: PickerProps) {
    super(props, { styles: PickerStyles })
  }

  async connectedCallback() {
    const props = getProps(this.props, defaultPickerProps, this)
    props.element = this
    props.ref = (component) => {
      this.component = component
    }

    await init(props)
    if (this.disconnected) return

    render(<Picker {...props} />, this.shadowRoot)
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('em-emoji-picker')
) {
  customElements.define('em-emoji-picker', PickerElement)
}
