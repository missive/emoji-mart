// import { PureComponent } from 'preact/compat'
import { Component } from 'preact'

export default class PureInlineComponent extends Component {
  shouldComponentUpdate(nextProps) {
    for (let k in nextProps) {
      if (k == 'children') continue

      if (nextProps[k] != this.props[k]) {
        return true
      }
    }

    return false
  }

  render() {
    return this.props.children
  }
}
