import React from 'react'
import { getEmojiDataFromNative } from '..'

import data from '../../../data/apple'

test('will find man lifting weights with skin tone 6', () => {
  const emojiData = getEmojiDataFromNative('🏋🏿‍♂️', 'apple', data)
  expect(emojiData.id).toEqual('man-lifting-weights')
  expect(emojiData.skin).toEqual(6)
})

test('will find woman swimming with skin tone 4', () => {
  const emojiData = getEmojiDataFromNative('🏊🏽‍♀️', 'apple', data)
  expect(emojiData.id).toEqual('woman-swimming')
  expect(emojiData.skin).toEqual(4)
})

test('will find person in lotus positions', () => {
  const emojiData = getEmojiDataFromNative('🧘', 'apple', data)
  expect(emojiData.id).toEqual('person_in_lotus_position')
  expect(emojiData.skin).toEqual(1)
})

test('returns null if no match', () => {
  const emojiData = getEmojiDataFromNative('', 'apple', data)
  expect(emojiData).toEqual(null)
})
