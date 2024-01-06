// @ts-nocheck
import { HTMLElement } from '.'

export default class ShadowElement extends HTMLElement {
  constructor(props, { styles } = {}) {
    super(props)

    this.setShadow()
    this.injectStyles(styles)
  }

  setShadow() {
    this.attachShadow({ mode: 'open' })
  }

  injectStyles(styles) {
    if (!styles) return

    const style = document.createElement('style')
    style.textContent = styles

    Object.entries(this.props.styleProps || {}).forEach(([key, value]) => {
      style.setAttribute(key, value)
    })

    this.shadowRoot.insertBefore(style, this.shadowRoot.firstChild)
  }
}
