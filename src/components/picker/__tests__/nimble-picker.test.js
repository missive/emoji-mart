import React from 'react'
import NimblePicker from '../nimble-picker'
import renderer from 'react-test-renderer'

import data from '../../../../data/apple'

function render(props = {}) {
  const defaultProps = { data }
  const component = renderer.create(
    <NimblePicker {...props} {...defaultProps} />,
  )
  return component.getInstance()
}

test('shows 10 categories by default', () => {
  const subject = render()
  expect(subject.categories.length).toEqual(10)
})

test('will not show some categories based upon our filter', () => {
  const subject = render({ emojisToShowFilter: () => false })
  expect(subject.categories.length).toEqual(2)
})

test('maintains category ids after it is filtered', () => {
  const subject = render({ emojisToShowFilter: () => true })
  const categoriesWithIds = subject.categories.filter((category) => category.id)
  expect(categoriesWithIds.length).toEqual(10)
})
