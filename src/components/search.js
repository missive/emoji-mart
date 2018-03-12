import React from 'react'
import data from '../data'
import { SearchPropTypes, SearchDefaultProps } from '../utils/shared-props'
import NimbleSearch from './nimble-search'

export default class Search extends React.PureComponent {
  render() {
    return <NimbleSearch {...this.props} {...this.state}/>
  }
}

Search.propTypes = SearchPropTypes
Search.defaultProps = { ...SearchDefaultProps, data }
