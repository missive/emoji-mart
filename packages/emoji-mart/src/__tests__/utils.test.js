import { jest } from '@jest/globals'
import { deepEqual, sleep } from '../utils'

jest.mock('../helpers', () => ({
  SearchIndex: {
    search: jest.fn(),
  },
}))

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

describe('getEmojiData', () => {
  let getEmojiData

  beforeEach(() => {
    jest.resetModules()
    getEmojiData = require('../utils').getEmojiData
  })

  const makeEmoji = (overrides = {}) => ({
    id: 'grinning',
    name: 'Grinning Face',
    keywords: ['happy', 'smile'],
    shortcodes: ':grinning:',
    skins: [{ native: '😀', unified: '1f600', shortcodes: ':grinning:' }],
    ...overrides,
  })

  test('returns basic emoji data fields', () => {
    const emoji = makeEmoji()
    const result = getEmojiData(emoji)
    expect(result).toEqual({
      id: 'grinning',
      name: 'Grinning Face',
      native: '😀',
      unified: '1f600',
      keywords: ['happy', 'smile'],
      shortcodes: ':grinning:',
    })
  })

  test('uses skin at specified skinIndex', () => {
    const emoji = makeEmoji({
      skins: [
        { native: '😀', unified: '1f600', shortcodes: ':grinning:' },
        {
          native: '😀🏽',
          unified: '1f600-1f3fd',
          shortcodes: ':grinning::skin-tone-4:',
        },
      ],
    })
    const result = getEmojiData(emoji, { skinIndex: 1 })
    expect(result.native).toBe('😀🏽')
    expect(result.unified).toBe('1f600-1f3fd')
    expect(result.skin).toBe(2)
  })

  test('falls back to skin[0] when skinIndex is out of bounds', () => {
    const emoji = makeEmoji()
    const result = getEmojiData(emoji, { skinIndex: 5 })
    expect(result.native).toBe('😀')
    expect(result.unified).toBe('1f600')
  })

  test('includes skin field when emoji has multiple skins', () => {
    const emoji = makeEmoji({
      skins: [
        { native: '😀', unified: '1f600', shortcodes: ':grinning:' },
        {
          native: '😀🏽',
          unified: '1f600-1f3fd',
          shortcodes: ':grinning::skin-tone-4:',
        },
      ],
    })
    const result = getEmojiData(emoji, { skinIndex: 0 })
    expect(result.skin).toBe(1)
  })

  test('does not include skin field when emoji has only one skin', () => {
    const emoji = makeEmoji()
    const result = getEmojiData(emoji)
    expect(result).not.toHaveProperty('skin')
  })

  test('includes src when skin has src', () => {
    const emoji = makeEmoji({
      skins: [
        {
          native: '😀',
          unified: '1f600',
          shortcodes: ':grinning:',
          src: 'https://example.com/emoji.png',
        },
      ],
    })
    const result = getEmojiData(emoji)
    expect(result.src).toBe('https://example.com/emoji.png')
  })

  test('does not include src when skin has no src', () => {
    const emoji = makeEmoji()
    const result = getEmojiData(emoji)
    expect(result).not.toHaveProperty('src')
  })

  test('includes aliases when emoji has aliases', () => {
    const emoji = makeEmoji({ aliases: ['grin', 'smile_face'] })
    const result = getEmojiData(emoji)
    expect(result.aliases).toEqual(['grin', 'smile_face'])
  })

  test('does not include aliases when emoji has none', () => {
    const emoji = makeEmoji()
    const result = getEmojiData(emoji)
    expect(result).not.toHaveProperty('aliases')
  })

  test('includes emoticons when emoji has emoticons', () => {
    const emoji = makeEmoji({ emoticons: [':)', ':D'] })
    const result = getEmojiData(emoji)
    expect(result.emoticons).toEqual([':)', ':D'])
  })

  test('does not include emoticons when emoji has none', () => {
    const emoji = makeEmoji()
    const result = getEmojiData(emoji)
    expect(result).not.toHaveProperty('emoticons')
  })

  test('uses skin.shortcodes over emoji.shortcodes when available', () => {
    const emoji = makeEmoji({
      shortcodes: ':emoji-level:',
      skins: [{ native: '😀', unified: '1f600', shortcodes: ':skin-level:' }],
    })
    const result = getEmojiData(emoji)
    expect(result.shortcodes).toBe(':skin-level:')
  })

  test('falls back to emoji.shortcodes when skin has none', () => {
    const emoji = makeEmoji({
      shortcodes: ':emoji-level:',
      skins: [{ native: '😀', unified: '1f600' }],
    })
    const result = getEmojiData(emoji)
    expect(result.shortcodes).toBe(':emoji-level:')
  })
})

describe('getEmojiDataFromNative', () => {
  let getEmojiDataFromNative
  let SearchIndex

  beforeEach(() => {
    jest.resetModules()
    getEmojiDataFromNative = require('../utils').getEmojiDataFromNative
    SearchIndex = require('../helpers').SearchIndex
  })

  test('returns null when no results found', async () => {
    SearchIndex.search.mockResolvedValue([])
    const result = await getEmojiDataFromNative('😀')
    expect(result).toBeNull()
  })

  test('returns null when search returns null', async () => {
    SearchIndex.search.mockResolvedValue(null)
    const result = await getEmojiDataFromNative('😀')
    expect(result).toBeNull()
  })

  test('finds emoji by native character and returns data', async () => {
    const mockEmoji = {
      id: 'grinning',
      name: 'Grinning Face',
      keywords: ['happy'],
      shortcodes: ':grinning:',
      skins: [{ native: '😀', unified: '1f600', shortcodes: ':grinning:' }],
    }
    SearchIndex.search.mockResolvedValue([mockEmoji])
    const result = await getEmojiDataFromNative('😀')
    expect(result).toMatchObject({
      id: 'grinning',
      name: 'Grinning Face',
      native: '😀',
      unified: '1f600',
    })
  })

  test('finds correct skin index for multi-skin emoji', async () => {
    const mockEmoji = {
      id: 'wave',
      name: 'Waving Hand',
      keywords: ['wave'],
      shortcodes: ':wave:',
      skins: [
        { native: '👋', unified: '1f44b', shortcodes: ':wave:' },
        {
          native: '👋🏻',
          unified: '1f44b-1f3fb',
          shortcodes: ':wave::skin-tone-2:',
        },
        {
          native: '👋🏽',
          unified: '1f44b-1f3fd',
          shortcodes: ':wave::skin-tone-4:',
        },
      ],
    }
    SearchIndex.search.mockResolvedValue([mockEmoji])
    const result = await getEmojiDataFromNative('👋🏽')
    expect(result.native).toBe('👋🏽')
    expect(result.skin).toBe(3)
  })

  test('calls SearchIndex.search with correct arguments', async () => {
    SearchIndex.search.mockResolvedValue(null)
    await getEmojiDataFromNative('👍')
    expect(SearchIndex.search).toHaveBeenCalledWith('👍', {
      maxResults: 1,
      caller: 'getEmojiDataFromNative',
    })
  })
})
