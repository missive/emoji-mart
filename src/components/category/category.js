import React from 'react'
import data from '../../data'
import NimbleCategory from './nimble-category'

import {
  CategoryPropTypes,
  CategoryDefaultProps,
} from '../../utils/shared-props'

export default class Category extends React.Component {
  render() {
    return <NimbleCategory {...this.props} {...this.state} />
  }
}

Category.propTypes = { ...CategoryPropTypes }
Category.defaultProps = { ...CategoryDefaultProps, data }
