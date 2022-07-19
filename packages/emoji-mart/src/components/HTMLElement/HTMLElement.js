const WindowHTMLElement =
  typeof window !== 'undefined' ? window.HTMLElement : Object

export default class HTMLElement extends WindowHTMLElement {
  constructor(props = {}) {
    super()
    this.props = props

    if (props.parent || props.ref) {
      const parent = props.parent || (props.ref && props.ref.current)
      if (parent) parent.appendChild(this)
    }
  }
}
