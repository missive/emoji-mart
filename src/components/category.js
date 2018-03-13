import React from 'react'
import data from '../data'
import { CategoryPropTypes, CategoryDefaultProps } from '../utils/shared-props'
import NimbleCategory from './nimble-category'

export default class Category extends React.Component {
  render() {
    return <NimbleCategory {...this.props} {...this.state}/>
  }
}

Category.propTypes = { ...CategoryPropTypes }
Category.defaultProps = { ...CategoryDefaultProps, data }
