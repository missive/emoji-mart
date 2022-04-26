import { jest } from '@jest/globals'
import { deepEqual, sleep } from '../utils'

describe('deepEqual', () => {
  test('validates deep equality', () => {
    expect(deepEqual([], [])).toBe(true)
    expect(deepEqual([0, 0], [0, 0])).toBe(true)
    expect(deepEqual([0, 1], [1, 0])).toBe(false)
  })
})

describe('sleep', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame')
  })

  afterEach(() => {
    window.requestAnimationFrame.mockRestore()
  })

  test('sleep', async () => {
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(0)
    await sleep(1)
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1)
    await sleep(2)
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(3)
  })
})
