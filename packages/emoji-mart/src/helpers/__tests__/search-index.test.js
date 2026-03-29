import { jest } from '@jest/globals'

const mockEmojis = {
  grinning: {
    id: 'grinning',
    name: 'Grinning Face',
    keywords: ['smile', 'happy'],
    skins: [{ unified: '1f600', native: '😀' }],
    search: ',grinning,grinning,face,smile,happy',
  },
  smiley: {
    id: 'smiley',
    name: 'Smiley Face',
    keywords: ['happy', 'joy'],
    skins: [{ unified: '1f603', native: '😃' }],
    search: ',smiley,smiley,face,happy,joy',
  },
  dog: {
    id: 'dog',
    name: 'Dog Face',
    keywords: ['pet', 'animal'],
    skins: [{ unified: '1f436', native: '🐶' }],
    search: ',dog,dog,face,pet,animal',
  },
  heart: {
    id: 'heart',
    name: 'Red Heart',
    keywords: ['love'],
    skins: [{ unified: '2764', native: '❤️' }],
    search: ',heart,red,heart,love',
  },
}

const mockData = {
  emojis: mockEmojis,
  aliases: { satisfied: 'grinning', thumbsup: 'grinning' },
  natives: { '😀': 'grinning', '😃': 'smiley' },
}

jest.mock('../../config', () => ({
  init: jest.fn().mockResolvedValue(undefined),
  Data: mockData,
}))

let SearchIndex

beforeEach(() => {
  jest.resetModules()
  SearchIndex = require('../search-index').default
  // reset Pool so each test starts fresh
  SearchIndex.reset()
})

describe('SearchIndex', () => {
  describe('SHORTCODES_REGEX', () => {
    test('matches :shortcode: format', () => {
      expect(SearchIndex.SHORTCODES_REGEX.test(':grinning:')).toBe(true)
    })

    test('matches :shortcode::skin-tone-2: format', () => {
      expect(SearchIndex.SHORTCODES_REGEX.test(':wave::skin-tone-2:')).toBe(
        true,
      )
    })

    test('does not match plain text', () => {
      expect(SearchIndex.SHORTCODES_REGEX.test('grinning')).toBe(false)
    })

    test('captures shortcode name in group 1', () => {
      const match = ':grinning:'.match(SearchIndex.SHORTCODES_REGEX)
      expect(match[1]).toBe('grinning')
    })

    test('captures skin tone digit in group 2', () => {
      const match = ':wave::skin-tone-3:'.match(SearchIndex.SHORTCODES_REGEX)
      expect(match[2]).toBe('3')
    })

    test('does not match text with only one colon', () => {
      expect(SearchIndex.SHORTCODES_REGEX.test(':grinning')).toBe(false)
    })
  })

  describe('get()', () => {
    test('returns emoji by ID', () => {
      expect(SearchIndex.get('grinning')).toBe(mockEmojis.grinning)
    })

    test('returns emoji by alias', () => {
      expect(SearchIndex.get('satisfied')).toBe(mockEmojis.grinning)
    })

    test('returns emoji by native character', () => {
      expect(SearchIndex.get('😀')).toBe(mockEmojis.grinning)
    })

    test('returns object as-is if it has .id property', () => {
      const emojiObj = { id: 'grinning', name: 'Test' }
      expect(SearchIndex.get(emojiObj)).toBe(emojiObj)
    })

    test('returns undefined for unknown ID', () => {
      expect(SearchIndex.get('nonexistent')).toBeUndefined()
    })
  })

  describe('search()', () => {
    test('returns null for empty string', async () => {
      const result = await SearchIndex.search('')
      expect(result).toBeNull()
    })

    test('returns null for whitespace-only string', async () => {
      const result = await SearchIndex.search('   ')
      expect(result).toBeNull()
    })

    test('finds emoji by exact ID match', async () => {
      const result = await SearchIndex.search('grinning')
      expect(result).not.toBeNull()
      const ids = result.map((e) => e.id)
      expect(ids).toContain('grinning')
    })

    test('finds emoji by keyword match', async () => {
      const result = await SearchIndex.search('pet')
      expect(result).not.toBeNull()
      const ids = result.map((e) => e.id)
      expect(ids).toContain('dog')
    })

    test('returns results sorted so exact ID match comes first (score 0)', async () => {
      const result = await SearchIndex.search('grinning')
      expect(result).not.toBeNull()
      expect(result.length).toBeGreaterThan(0)
      expect(result[0].id).toBe('grinning')
    })

    test('respects maxResults limit', async () => {
      // All 4 emojis have "face" in their search string
      const result = await SearchIndex.search('face', { maxResults: 2 })
      expect(result).not.toBeNull()
      expect(result.length).toBeLessThanOrEqual(2)
    })

    test('handles multi-word search (intersection)', async () => {
      // "happy face" - only grinning and smiley have both "happy" and "face"
      const result = await SearchIndex.search('happy face')
      expect(result).not.toBeNull()
      const ids = result.map((e) => e.id)
      expect(ids).toContain('grinning')
      expect(ids).toContain('smiley')
      expect(ids).not.toContain('dog')
      expect(ids).not.toContain('heart')
    })

    test('is case insensitive', async () => {
      const lower = await SearchIndex.search('grinning')
      const upper = await SearchIndex.search('GRINNING')
      expect(lower).not.toBeNull()
      expect(upper).not.toBeNull()
      expect(lower.map((e) => e.id)).toEqual(upper.map((e) => e.id))
    })

    test('calls init() before searching', async () => {
      const { init } = require('../../config')
      await SearchIndex.search('dog')
      expect(init).toHaveBeenCalled()
    })

    test('returns empty array when no results match', async () => {
      const result = await SearchIndex.search('zzznomatch')
      expect(result).toEqual([])
    })

    test('deduplicates repeated search terms', async () => {
      // "happy happy" should behave like "happy"
      const single = await SearchIndex.search('happy')
      const repeated = await SearchIndex.search('happy happy')
      expect(repeated).not.toBeNull()
      expect(single).not.toBeNull()
      expect(repeated.map((e) => e.id).sort()).toEqual(
        single.map((e) => e.id).sort(),
      )
    })
  })

  describe('reset()', () => {
    test('clears the pool so it rebuilds on next search', async () => {
      // Do a first search to populate the Pool
      await SearchIndex.search('grinning')

      // Reset should clear Pool
      SearchIndex.reset()

      // After reset, search should still work (Pool rebuilds from Data.emojis)
      const result = await SearchIndex.search('grinning')
      expect(result).not.toBeNull()
      expect(result.map((e) => e.id)).toContain('grinning')
    })

    test('is safe to call multiple times', () => {
      expect(() => {
        SearchIndex.reset()
        SearchIndex.reset()
      }).not.toThrow()
    })
  })
})
