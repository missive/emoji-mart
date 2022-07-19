const WindowHTMLElement =
  typeof window !== 'undefined' ? window.HTMLElement : Object

export default class HTMLElement extends WindowHTMLElement {
  constructor(props = {}) {
    super()
    this.props = props

    if (props.parent || props.ref) {
      let ref = null
      const parent = props.parent || (ref = props.ref && props.ref.current)

      if (ref) ref.innerHTML = ''
      if (parent) parent.appendChild(this)
    }
  }
}
