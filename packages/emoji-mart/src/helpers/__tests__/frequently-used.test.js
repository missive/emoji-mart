import { jest } from '@jest/globals'

jest.mock('../../helpers', () => ({
  Store: {
    get: jest.fn(),
    set: jest.fn(),
  },
}))

let FrequentlyUsed
let Store

beforeEach(() => {
  jest.resetModules()
  FrequentlyUsed = require('../frequently-used').default
  Store = require('../../helpers').Store
  Store.get.mockClear()
  Store.set.mockClear()
})

describe('FrequentlyUsed', () => {
  describe('DEFAULTS', () => {
    test('exports 15 default emoji IDs', () => {
      expect(FrequentlyUsed.DEFAULTS).toHaveLength(15)
    })

    test('contains expected emoji IDs', () => {
      expect(FrequentlyUsed.DEFAULTS).toContain('+1')
      expect(FrequentlyUsed.DEFAULTS).toContain('grinning')
      expect(FrequentlyUsed.DEFAULTS).toContain('heart')
    })
  })

  describe('get()', () => {
    describe('with no stored data (first time)', () => {
      beforeEach(() => {
        Store.get.mockReturnValue(undefined)
      })

      test('returns empty array when maxFrequentRows is 0', () => {
        const result = FrequentlyUsed.get({ maxFrequentRows: 0, perLine: 9 })
        expect(result).toEqual([])
      })

      test('returns first perLine defaults when no stored data', () => {
        const result = FrequentlyUsed.get({ maxFrequentRows: 4, perLine: 9 })
        expect(result).toHaveLength(9)
        expect(result).toEqual(FrequentlyUsed.DEFAULTS.slice(0, 9))
      })

      test('returns fewer defaults when perLine exceeds DEFAULTS length', () => {
        const result = FrequentlyUsed.get({ maxFrequentRows: 4, perLine: 20 })
        expect(result).toHaveLength(FrequentlyUsed.DEFAULTS.length)
      })
    })

    describe('with stored data', () => {
      test('returns emojis sorted by frequency (highest first)', () => {
        Store.get.mockImplementation((key) => {
          if (key === 'frequently') return { joy: 5, grinning: 10, heart: 3 }
          if (key === 'last') return 'grinning'
        })

        const result = FrequentlyUsed.get({ maxFrequentRows: 4, perLine: 9 })
        expect(result[0]).toBe('grinning')
        expect(result[1]).toBe('joy')
        expect(result[2]).toBe('heart')
      })

      test('respects max limit (maxFrequentRows * perLine)', () => {
        const frequentlyData = {}
        for (let i = 0; i < 20; i++) {
          frequentlyData[`emoji_${i}`] = 20 - i
        }

        Store.get.mockImplementation((key) => {
          if (key === 'frequently') return frequentlyData
          if (key === 'last') return 'emoji_0'
        })

        const result = FrequentlyUsed.get({ maxFrequentRows: 2, perLine: 5 })
        expect(result).toHaveLength(10)
      })

      test('keeps "last" emoji when truncating even if outside top results', () => {
        const frequentlyData = {}
        for (let i = 0; i < 20; i++) {
          frequentlyData[`emoji_${i}`] = 20 - i
        }
        // emoji_19 has the lowest score (1), so it would normally be cut
        Store.get.mockImplementation((key) => {
          if (key === 'frequently') return frequentlyData
          if (key === 'last') return 'emoji_19'
        })

        const result = FrequentlyUsed.get({ maxFrequentRows: 1, perLine: 5 })
        expect(result).toContain('emoji_19')
      })

      test('sorts ties alphabetically', () => {
        Store.get.mockImplementation((key) => {
          if (key === 'frequently') return { banana: 5, apple: 5, cherry: 5 }
          if (key === 'last') return 'apple'
        })

        const result = FrequentlyUsed.get({ maxFrequentRows: 4, perLine: 9 })
        expect(result).toEqual(['apple', 'banana', 'cherry'])
      })
    })
  })

  describe('add()', () => {
    test('increments count for emoji object', () => {
      Store.get.mockReturnValue({})

      FrequentlyUsed.add({ id: 'grinning' })

      const setCall = Store.set.mock.calls.find((c) => c[0] === 'frequently')
      expect(setCall).toBeDefined()
      expect(setCall[1]).toEqual({ grinning: 1 })
    })

    test('increments count again on repeated calls', () => {
      Store.get.mockReturnValue({ grinning: 2 })

      FrequentlyUsed.add({ id: 'grinning' })

      const setCall = Store.set.mock.calls.find((c) => c[0] === 'frequently')
      expect(setCall[1].grinning).toBe(3)
    })

    test('stores "last" emoji ID to Store', () => {
      Store.get.mockReturnValue({})

      FrequentlyUsed.add({ id: 'joy' })

      const lastCall = Store.set.mock.calls.find((c) => c[0] === 'last')
      expect(lastCall).toBeDefined()
      expect(lastCall[1]).toBe('joy')
    })

    test('stores updated frequently object to Store', () => {
      Store.get.mockReturnValue({})

      FrequentlyUsed.add({ id: 'heart' })

      const frequentlyCall = Store.set.mock.calls.find(
        (c) => c[0] === 'frequently',
      )
      expect(frequentlyCall).toBeDefined()
      expect(frequentlyCall[1]).toHaveProperty('heart')
    })

    test('handles emoji passed as string (id property)', () => {
      Store.get.mockReturnValue({})

      FrequentlyUsed.add({ id: 'sunglasses' })

      const setCall = Store.set.mock.calls.find((c) => c[0] === 'frequently')
      expect(setCall[1]).toHaveProperty('sunglasses')
    })

    test('ignores falsy emojiId', () => {
      Store.get.mockReturnValue({})

      // The code does: const emojiId = emoji.id || emoji
      // Passing an empty string: ''.id === undefined, so emojiId = '' which is falsy
      FrequentlyUsed.add('')

      expect(Store.set).not.toHaveBeenCalled()
    })

    test('initializes from Store if Index is null', () => {
      Store.get.mockReturnValue(null)

      FrequentlyUsed.add({ id: 'grinning' })

      const setCall = Store.set.mock.calls.find((c) => c[0] === 'frequently')
      expect(setCall[1]).toEqual({ grinning: 1 })
    })
  })
})
