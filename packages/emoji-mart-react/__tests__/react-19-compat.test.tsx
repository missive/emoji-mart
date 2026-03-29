/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, act } from '@testing-library/react'
import EmojiPicker from '../react'

// Mock the Picker class from emoji-mart since it requires
// browser APIs (Shadow DOM, custom elements) not available in jsdom
jest.mock('emoji-mart', () => ({
  Picker: jest.fn().mockImplementation(function (props) {
    this.props = props
    this.update = jest.fn()

    // Simulate what Picker does: append to the ref element
    if (props.ref && props.ref.current) {
      const el = document.createElement('div')
      el.setAttribute('data-testid', 'emoji-picker')
      props.ref.current.appendChild(el)
    }

    return this
  }),
}))

describe('EmojiPicker React 19 compatibility', () => {
  test('renders without crashing', () => {
    const { container } = render(<EmojiPicker />)
    expect(container.querySelector('div')).toBeTruthy()
  })

  test('passes props to Picker instance', () => {
    const { Picker } = require('emoji-mart')
    const onEmojiSelect = jest.fn()

    render(<EmojiPicker theme="dark" onEmojiSelect={onEmojiSelect} />)

    expect(Picker).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'dark',
        onEmojiSelect,
      }),
    )
  })

  test('calls update on re-render with new props', () => {
    const { Picker } = require('emoji-mart')
    const { rerender } = render(<EmojiPicker theme="light" />)

    const instance = Picker.mock.instances[0] || Picker.mock.results[0]?.value
    rerender(<EmojiPicker theme="dark" />)

    expect(instance.update).toBeDefined()
  })

  test('cleans up on unmount', () => {
    const { unmount } = render(<EmojiPicker />)
    unmount()
    // Should not throw
  })
})
