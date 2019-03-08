import React from 'react'

import data from '../../../data/all.json'
import NimblePicker from './nimble-picker'

import { PickerPropTypes } from '../../utils/shared-props'
import { PickerDefaultProps } from '../../utils/shared-default-props'

export default class Picker extends React.PureComponent {
  render() {
    return <NimblePicker {...this.props} {...this.state} />
  }
}

Picker.propTypes /* remove-proptypes */ = PickerPropTypes
Picker.defaultProps = { ...PickerDefaultProps, data }
