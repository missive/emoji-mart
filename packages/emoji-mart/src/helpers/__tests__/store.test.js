import Store from '../store'

describe('Store', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  describe('set', () => {
    test('stores value with emoji-mart. prefix', () => {
      Store.set('theme', 'dark')
      expect(window.localStorage['emoji-mart.theme']).toBe(
        JSON.stringify('dark'),
      )
    })

    test('JSON-serializes the value', () => {
      Store.set('prefs', { color: 'blue' })
      expect(window.localStorage['emoji-mart.prefs']).toBe('{"color":"blue"}')
    })

    test('silently handles localStorage errors', () => {
      const original = Object.getOwnPropertyDescriptor(window, 'localStorage')
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('localStorage unavailable')
        },
        configurable: true,
      })

      expect(() => Store.set('key', 'value')).not.toThrow()

      Object.defineProperty(window, 'localStorage', original)
    })
  })

  describe('get', () => {
    test('retrieves and parses stored value', () => {
      window.localStorage['emoji-mart.theme'] = JSON.stringify('light')
      expect(Store.get('theme')).toBe('light')
    })

    test('returns undefined for missing keys', () => {
      expect(Store.get('nonexistent')).toBeUndefined()
    })

    test('silently handles localStorage errors', () => {
      const original = Object.getOwnPropertyDescriptor(window, 'localStorage')
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('localStorage unavailable')
        },
        configurable: true,
      })

      expect(() => Store.get('key')).not.toThrow()
      expect(Store.get('key')).toBeUndefined()

      Object.defineProperty(window, 'localStorage', original)
    })

    test('returns undefined for invalid JSON', () => {
      window.localStorage['emoji-mart.bad'] = 'not-json{'
      expect(Store.get('bad')).toBeUndefined()
    })
  })

  describe('round-trip', () => {
    test('set then get returns original string value', () => {
      Store.set('color', 'red')
      expect(Store.get('color')).toBe('red')
    })

    test('set then get returns original object value', () => {
      const obj = { skin: 1, set: 'native' }
      Store.set('config', obj)
      expect(Store.get('config')).toEqual(obj)
    })

    test('set then get returns original array value', () => {
      const arr = ['grinning', 'thumbsup', 'heart']
      Store.set('recent', arr)
      expect(Store.get('recent')).toEqual(arr)
    })

    test('set then get returns original number value', () => {
      Store.set('skin', 3)
      expect(Store.get('skin')).toBe(3)
    })

    test('set then get returns original boolean value', () => {
      Store.set('native', true)
      expect(Store.get('native')).toBe(true)
    })
  })
})
