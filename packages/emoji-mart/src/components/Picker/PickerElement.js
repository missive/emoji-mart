import { render } from 'preact'

import { init } from '@config'
import { Picker, PickerStyles } from '.'

export default class PickerElement extends HTMLElement {
  constructor(props) {
    super()
    this.props = props

    this.setShadow()
    if (props.parent) {
      props.parent.appendChild(this)
    }
  }

  setShadow() {
    this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = PickerStyles

    this.shadowRoot.insertBefore(style, this.shadowRoot.firstChild)
  }

  async connectedCallback() {
    const pickerProps = await init(this.props, this)
    const props = { ...pickerProps }
    props.element = this

    render(<Picker {...props} />, this.shadowRoot)
  }
}

if (!customElements.get('em-emoji-picker')) {
  customElements.define('em-emoji-picker', PickerElement)
}
