import '../vendor/raf-polyfill'

import React from 'react'
import data from '../data'
import { PickerPropTypes, PickerDefaultProps } from '../utils/shared-props'
import NimblePicker from './nimble-picker'

export default class Picker extends React.PureComponent {
  render() {
    return <NimblePicker {...this.props} {...this.state}/>
  }
}

Picker.propTypes = PickerPropTypes
Picker.defaultProps = { ...PickerDefaultProps, data }
