import React from 'react'

import data from '../../data'
import NimblePreview from './nimble-preview'

import { PreviewPropTypes, PreviewDefaultProps } from '../../utils/shared-props'

export default class Preview extends React.PureComponent {
  render() {
    return <NimblePreview {...this.props} {...this.state} />
  }
}

Preview.propTypes = PreviewPropTypes
Preview.defaultProps = { ...PreviewDefaultProps, data }
