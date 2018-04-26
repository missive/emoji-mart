import React from 'react'

import data from '../../data'
import NimbleSearch from './nimble-search'

import { SearchPropTypes, SearchDefaultProps } from '../../utils/shared-props'

export default class Search extends React.PureComponent {
  render() {
    return <NimbleSearch {...this.props} {...this.state} />
  }
}

Search.propTypes = SearchPropTypes
Search.defaultProps = { ...SearchDefaultProps, data }
