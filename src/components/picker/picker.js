import React from 'react'

import data from '../../../data/all.json'
import NimblePicker from './nimble-picker'

import { PickerPropTypes, PickerDefaultProps } from '../../utils/shared-props'

export default class Picker extends React.PureComponent {
  render() {
    return <NimblePicker {...this.props} {...this.state} />
  }
}

Picker.propTypes = PickerPropTypes
Picker.defaultProps = { ...PickerDefaultProps, data }
