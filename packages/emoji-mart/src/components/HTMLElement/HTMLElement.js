import { getProp } from '../../config'

const WindowHTMLElement =
  typeof window !== 'undefined' ? window.HTMLElement : Object

export default class HTMLElement extends WindowHTMLElement {
  static get observedAttributes() {
    return Object.keys(this.Props)
  }

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

  update(props = {}) {
    for (let k in props) {
      this.attributeChangedCallback(k, null, props[k])
    }
  }

  attributeChangedCallback(attr, _, newValue) {
    if (!this.component) return

    const value = getProp(
      attr,
      { [attr]: newValue },
      this.constructor.Props,
      this,
    )

    if (this.component.componentWillReceiveProps) {
      this.component.componentWillReceiveProps({ [attr]: value })
    } else {
      this.component.props[attr] = value
      this.component.forceUpdate()
    }
  }
}
