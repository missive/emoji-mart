import React from 'react'
import TestUtils from 'react-dom/test-utils'

import data from '../data/all.json'
import { NimblePicker } from '../src/components'

const { click } = TestUtils.Simulate

const {
  renderIntoDocument,
  scryRenderedComponentsWithType,
  findRenderedComponentWithType,
} = TestUtils

const render = (props = {}) => {
  const defaultProps = { data }
  return renderIntoDocument(<NimblePicker {...defaultProps} {...props} />)
}

describe('NimblePicker', () => {
  let subject

  it('works', () => {
    subject = render()
    expect(subject).toBeDefined()
  })

  describe('categories', () => {
    it('shows 10 by default', () => {
      subject = render()
      expect(subject.categories.length).toEqual(10)
    })

    it('will not show some based upon our filter', () => {
      subject = render({ emojisToShowFilter: (unified) => false })
      expect(subject.categories.length).toEqual(2)
    })

    it('maintains category ids after it is filtered', () => {
      subject = render({ emojisToShowFilter: (emoji) => true })
      const categoriesWithIds = subject.categories.filter(
        (category) => category.id,
      )
      expect(categoriesWithIds.length).toEqual(10)
    })
  })
})
