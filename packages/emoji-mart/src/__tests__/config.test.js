import { jest } from '@jest/globals'

// Mock helpers to avoid side effects
jest.mock('../helpers', () => ({
  FrequentlyUsed: { get: jest.fn().mockReturnValue([]) },
  NativeSupport: { latestVersion: jest.fn(), noCountryFlags: jest.fn() },
  SafeFlags: ['checkered_flag'],
  SearchIndex: { reset: jest.fn() },
  Store: { get: jest.fn(), set: jest.fn() },
}))

// Mock the i18n import
jest.mock(
  '@emoji-mart/data/i18n/en.json',
  () => ({
    categories: { custom: 'Custom' },
    search: 'Search',
  }),
  { virtual: true },
)

function createTestData() {
  return {
    categories: [
      { id: 'people', emojis: ['grinning', 'smiley'] },
      { id: 'nature', emojis: ['dog'] },
    ],
    emojis: {
      grinning: {
        id: 'grinning',
        name: 'Grinning Face',
        emoticons: [':D'],
        keywords: ['smile', 'happy'],
        skins: [{ unified: '1f600', native: '😀' }],
        version: 1,
      },
      smiley: {
        id: 'smiley',
        name: 'Smiley Face',
        keywords: ['happy'],
        skins: [{ unified: '1f603', native: '😃' }],
        version: 1,
      },
      dog: {
        id: 'dog',
        name: 'Dog Face',
        keywords: ['pet'],
        skins: [{ unified: '1f436', native: '🐶' }],
        version: 1,
      },
    },
    aliases: { satisfied: 'grinning' },
    sheet: { cols: 61, rows: 61 },
  }
}

let config

beforeEach(() => {
  jest.resetModules()
  config = require('../config')
})

// ─── init() ───────────────────────────────────────────────────────────────────

describe('init()', () => {
  test('sets Data when called with data option', async () => {
    const data = createTestData()
    await config.init({ data })
    expect(config.Data).not.toBeNull()
    expect(config.Data.emojis.grinning).toBeDefined()
  })

  test('creates emoticons map on Data', async () => {
    const data = createTestData()
    await config.init({ data })
    expect(config.Data.emoticons).toBeDefined()
    expect(config.Data.emoticons[':D']).toBe('grinning')
  })

  test('creates natives map on Data', async () => {
    const data = createTestData()
    await config.init({ data })
    expect(config.Data.natives).toBeDefined()
    expect(config.Data.natives['😀']).toBe('grinning')
    expect(config.Data.natives['😃']).toBe('smiley')
  })

  test('adds frequent category at front of categories (removed when empty)', async () => {
    const data = createTestData()
    await config.init({ data })
    // FrequentlyUsed.get returns [] so 'frequent' gets populated with [] and then
    // the category is encountered empty on the next pass — actually, frequent is
    // set via FrequentlyUsed.get, which returns [], so it's empty when the splice
    // check runs, meaning it gets removed from the final categories list.
    const ids = config.Data.categories.map((c) => c.id)
    expect(ids).not.toContain('frequent')
    // The originalCategories array includes 'frequent' as the first entry
    // (same reference as categories until categories gets reassigned)
    // people and nature should still be present
    expect(ids).toContain('people')
  })

  test('processes aliases into emoji.aliases arrays', async () => {
    const data = createTestData()
    await config.init({ data })
    expect(config.Data.emojis.grinning.aliases).toContain('satisfied')
  })

  test('builds emoji.search strings', async () => {
    const data = createTestData()
    await config.init({ data })
    expect(config.Data.emojis.grinning.search).toMatch(/grinning/)
    expect(config.Data.emojis.grinning.search).toMatch(/smile/)
    // emoticons are lowercased when stored in search string
    expect(config.Data.emojis.grinning.search).toMatch(/:d/)
  })

  test('builds search string including native emoji character', async () => {
    const data = createTestData()
    await config.init({ data })
    expect(config.Data.emojis.grinning.search).toContain('😀')
  })

  test('sets shortcodes on skin objects', async () => {
    const data = createTestData()
    await config.init({ data })
    expect(config.Data.emojis.grinning.skins[0].shortcodes).toBe(':grinning:')
  })

  test('sets I18n after init', async () => {
    const data = createTestData()
    await config.init({ data })
    expect(config.I18n).not.toBeNull()
    expect(config.I18n.search).toBe('Search')
  })

  test('accepts data as async function', async () => {
    const data = createTestData()
    const dataFn = jest.fn().mockResolvedValue(data)
    await config.init({ data: dataFn })
    expect(dataFn).toHaveBeenCalledTimes(1)
    expect(config.Data).not.toBeNull()
    expect(config.Data.emojis.grinning).toBeDefined()
  })

  test('resolves returned promise after init', async () => {
    const data = createTestData()
    const promise = config.init({ data })
    await expect(promise).resolves.toBeUndefined()
  })

  test('handles custom emoji categories', async () => {
    const data = createTestData()
    const customEmoji = {
      id: 'party_blob',
      name: 'Party Blob',
      keywords: ['party'],
      skins: [{ src: 'https://example.com/party.gif' }],
    }
    await config.init({
      data,
      custom: [
        {
          id: 'custom_party',
          name: 'Party',
          emojis: [customEmoji],
        },
      ],
    })
    const customCategory = config.Data.categories.find(
      (c) => c.id === 'custom_party',
    )
    expect(customCategory).toBeDefined()
    expect(config.Data.emojis.party_blob).toBeDefined()
  })

  test('assigns default custom category id when not provided', async () => {
    const data = createTestData()
    const customEmoji = {
      id: 'my_custom',
      name: 'My Custom',
      keywords: [],
      skins: [{ src: 'https://example.com/custom.gif' }],
    }
    await config.init({
      data,
      custom: [{ emojis: [customEmoji] }],
    })
    const customCategory = config.Data.categories.find((c) =>
      c.id?.startsWith('custom_'),
    )
    expect(customCategory).toBeDefined()
    expect(customCategory.id).toBe('custom_1')
  })

  test('filters categories when options.categories is provided', async () => {
    const data = createTestData()
    await config.init({ data, categories: ['nature'] })
    const ids = config.Data.categories.map((c) => c.id)
    expect(ids).toContain('nature')
    expect(ids).not.toContain('people')
  })

  test('sorts categories according to options.categories order', async () => {
    const data = createTestData()
    await config.init({ data, categories: ['nature', 'people'] })
    const ids = config.Data.categories.map((c) => c.id)
    expect(ids.indexOf('nature')).toBeLessThan(ids.indexOf('people'))
  })

  test('excludes emojis via exceptEmojis', async () => {
    const data = createTestData()
    await config.init({ data, exceptEmojis: ['grinning'] })
    const peopleCategory = config.Data.categories.find((c) => c.id === 'people')
    expect(peopleCategory.emojis).not.toContain('grinning')
    expect(peopleCategory.emojis).toContain('smiley')
  })

  test('nature category has empty emojis after all are excluded via exceptEmojis', async () => {
    const data = createTestData()
    // Exclude the only emoji in 'nature' category
    await config.init({ data, exceptEmojis: ['dog'] })
    // The init code splices categories that are empty when FIRST encountered in the loop.
    // After the emoji-level splice removes 'dog', the nature category has emojis:[].
    // The splice check runs at the start of each category's iteration, so nature won't
    // be removed in this pass — it remains with an empty emojis array.
    const natureCategory = config.Data.categories.find((c) => c.id === 'nature')
    expect(natureCategory).toBeDefined()
    expect(natureCategory.emojis).toHaveLength(0)
  })

  test('uses custom i18n when provided', async () => {
    const data = createTestData()
    const customI18n = {
      search: 'Suche',
      categories: { custom: 'Benutzerdefiniert' },
    }
    await config.init({ data, i18n: customI18n })
    expect(config.I18n.search).toBe('Suche')
  })

  test('accepts i18n as async function', async () => {
    const data = createTestData()
    const customI18n = {
      search: 'Chercher',
      categories: { custom: 'Personnalisé' },
    }
    const i18nFn = jest.fn().mockResolvedValue(customI18n)
    await config.init({ data, i18n: i18nFn })
    expect(i18nFn).toHaveBeenCalledTimes(1)
    expect(config.I18n.search).toBe('Chercher')
  })

  test('skips custom category if it has no emojis', async () => {
    const data = createTestData()
    const categoriesBefore = data.categories.length
    await config.init({
      data,
      custom: [{ id: 'empty_custom', name: 'Empty', emojis: [] }],
    })
    // The empty custom category should not appear
    const customCategory = config.Data.categories.find(
      (c) => c.id === 'empty_custom',
    )
    expect(customCategory).toBeUndefined()
  })

  // ── fetchJSON (lines 15-25) ────────────────────────────────────────────────

  test('fetchJSON: fetches data from CDN when no data option provided', async () => {
    const data = createTestData()
    const mockFetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(data),
    })
    global.fetch = mockFetch

    await config.init({})

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const calledUrl = mockFetch.mock.calls[0][0]
    expect(calledUrl).toMatch(/cdn\.jsdelivr\.net/)
    expect(calledUrl).toMatch(/emoji-mart\/data/)

    delete global.fetch
  })

  test('fetchJSON: caches results so fetch is only called once per URL', async () => {
    const data = createTestData()
    const i18nDe = {
      search: 'Suchen',
      categories: { custom: 'Benutzerdefiniert' },
    }
    const mockFetch = jest
      .fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve(data) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(i18nDe) })
    global.fetch = mockFetch

    // First init — fetches both data and i18n for locale 'de'
    await config.init({ locale: 'de' })
    expect(mockFetch).toHaveBeenCalledTimes(2)

    // Second init triggers re-init path (Data already exists) but i18n CDN URL
    // is the same — fetchCache should serve it without another fetch call
    await config.init({ locale: 'de' })
    expect(mockFetch).toHaveBeenCalledTimes(2) // still 2, cache was hit for i18n

    delete global.fetch
  })

  // ── caller warning (lines 41-44) ──────────────────────────────────────────

  test('logs console.warn when caller is provided but data is not initialized', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    // Call init without options but with a caller — Data is not yet initialized
    config.init(null, { caller: 'MyComponent' })

    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy.mock.calls[0][0]).toContain('MyComponent')

    warnSpy.mockRestore()
  })

  // ── re-init with existing Data — filter custom categories (lines 83-89) ───

  test('second init call strips previously added custom categories from Data', async () => {
    const data = createTestData()
    const customEmoji = {
      id: 'blob_party',
      name: 'Blob Party',
      keywords: ['party'],
      skins: [{ src: 'https://example.com/blob.gif' }],
    }

    // First init: add a custom category
    await config.init({
      data,
      custom: [{ id: 'custom_blobs', name: 'Blobs', emojis: [customEmoji] }],
    })
    expect(
      config.Data.categories.find((c) => c.id === 'custom_blobs'),
    ).toBeDefined()

    // Second init (Data already set): custom categories should be filtered out
    await config.init({ data })
    expect(
      config.Data.categories.find((c) => c.id === 'custom_blobs'),
    ).toBeUndefined()
  })

  // ── i18n as function / non-English locale via fetchJSON (lines 91-97) ─────

  test('fetchJSON: fetches i18n from CDN when locale is non-English and no i18n provided', async () => {
    const data = createTestData()
    const i18nData = {
      search: 'Suchen',
      categories: { custom: 'Benutzerdefiniert' },
    }
    const mockFetch = jest
      .fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve(data) }) // data fetch
      .mockResolvedValueOnce({ json: () => Promise.resolve(i18nData) }) // i18n fetch
    global.fetch = mockFetch

    await config.init({ locale: 'de' })

    expect(mockFetch).toHaveBeenCalledTimes(2)
    const i18nUrl = mockFetch.mock.calls[1][0]
    expect(i18nUrl).toMatch(/i18n\/de\.json/)
    expect(config.I18n.search).toBe('Suchen')

    delete global.fetch
  })

  // ── custom category target (lines 111-112) ────────────────────────────────

  test('second custom category without icon gets target pointing to first custom category', async () => {
    const data = createTestData()
    const emoji1 = {
      id: 'custom_a',
      name: 'Custom A',
      keywords: [],
      skins: [{ src: 'https://example.com/a.gif' }],
    }
    const emoji2 = {
      id: 'custom_b',
      name: 'Custom B',
      keywords: [],
      skins: [{ src: 'https://example.com/b.gif' }],
    }
    const cat1 = { id: 'cat1', name: 'Cat 1', emojis: [emoji1] }
    const cat2 = { id: 'cat2', name: 'Cat 2', emojis: [emoji2] } // no icon

    await config.init({ data, custom: [cat1, cat2] })

    const storedCat2 = config.Data.categories.find((c) => c.id === 'cat2')
    expect(storedCat2).toBeDefined()
    // target should be set to cat1 (or cat1.target if cat1 already had a target)
    expect(storedCat2.target).toBeDefined()
    expect(storedCat2.target.id).toBe('cat1')
  })

  test('second custom category with icon does not get target set', async () => {
    const data = createTestData()
    const emoji1 = {
      id: 'custom_x',
      name: 'Custom X',
      keywords: [],
      skins: [{ src: 'https://example.com/x.gif' }],
    }
    const emoji2 = {
      id: 'custom_y',
      name: 'Custom Y',
      keywords: [],
      skins: [{ src: 'https://example.com/y.gif' }],
    }
    const cat1 = { id: 'catX', name: 'Cat X', emojis: [emoji1] }
    const cat2 = {
      id: 'catY',
      name: 'Cat Y',
      emojis: [emoji2],
      icon: 'some-icon',
    }

    await config.init({ data, custom: [cat1, cat2] })

    const storedCat2 = config.Data.categories.find((c) => c.id === 'catY')
    expect(storedCat2).toBeDefined()
    expect(storedCat2.target).toBeUndefined()
  })

  // ── categoryIcons (lines 166-170) ─────────────────────────────────────────

  test('categoryIcons option sets icons on matching categories', async () => {
    const data = createTestData()
    const categoryIcons = {
      people: { svg: '<svg>people</svg>' },
      nature: { svg: '<svg>nature</svg>' },
    }

    await config.init({ data, categoryIcons })

    const peopleCategory = config.Data.categories.find((c) => c.id === 'people')
    expect(peopleCategory).toBeDefined()
    expect(peopleCategory.icon).toEqual({ svg: '<svg>people</svg>' })

    const natureCategory = config.Data.categories.find((c) => c.id === 'nature')
    expect(natureCategory).toBeDefined()
    expect(natureCategory.icon).toEqual({ svg: '<svg>nature</svg>' })
  })

  test('categoryIcons does not overwrite icon when category already has one', async () => {
    const data = createTestData()
    // Give the people category an existing icon
    data.categories[0].icon = 'existing-icon'

    const categoryIcons = {
      people: { svg: '<svg>new-icon</svg>' },
    }

    await config.init({ data, categoryIcons })

    const peopleCategory = config.Data.categories.find((c) => c.id === 'people')
    expect(peopleCategory.icon).toBe('existing-icon')
  })

  // ── noCountryFlags + SafeFlags (lines 190-199) ────────────────────────────

  test('noCountryFlags filters non-safe flag emojis from flags category', async () => {
    const { NativeSupport } = require('../helpers')
    NativeSupport.latestVersion.mockReturnValue(14)
    NativeSupport.noCountryFlags.mockReturnValue(true)

    const data = {
      categories: [{ id: 'flags', emojis: ['checkered_flag', 'flag_us'] }],
      emojis: {
        checkered_flag: {
          id: 'checkered_flag',
          name: 'Checkered Flag',
          keywords: ['racing'],
          skins: [{ unified: '1f3c1', native: '🏁' }],
          version: 1,
        },
        flag_us: {
          id: 'flag_us',
          name: 'United States',
          keywords: ['usa'],
          skins: [{ unified: '1f1fa-1f1f8', native: '🇺🇸' }],
          version: 1,
        },
      },
      aliases: {},
      sheet: { cols: 61, rows: 61 },
    }

    await config.init({ data, set: 'native', noCountryFlags: true })

    const flagsCategory = config.Data.categories.find((c) => c.id === 'flags')
    // checkered_flag is in SafeFlags mock, so it stays; flag_us is not safe, so removed
    expect(flagsCategory.emojis).toContain('checkered_flag')
    expect(flagsCategory.emojis).not.toContain('flag_us')
  })

  // ── latestVersionSupport — emoji version too new (lines 189-192) ───────────

  test('filters out emojis whose version exceeds native support latestVersion', async () => {
    const { NativeSupport } = require('../helpers')
    NativeSupport.latestVersion.mockReturnValue(1)
    NativeSupport.noCountryFlags.mockReturnValue(false)

    const data = {
      categories: [{ id: 'people', emojis: ['emoji_v1', 'emoji_v2'] }],
      emojis: {
        emoji_v1: {
          id: 'emoji_v1',
          name: 'Emoji Version 1',
          keywords: ['old'],
          skins: [{ unified: '1f600', native: '😀' }],
          version: 1,
        },
        emoji_v2: {
          id: 'emoji_v2',
          name: 'Emoji Version 2',
          keywords: ['new'],
          skins: [{ unified: '1f972', native: '🥲' }],
          version: 2,
        },
      },
      aliases: {},
      sheet: { cols: 61, rows: 61 },
    }

    await config.init({ data, set: 'native' })

    const peopleCategory = config.Data.categories.find((c) => c.id === 'people')
    expect(peopleCategory.emojis).toContain('emoji_v1')
    expect(peopleCategory.emojis).not.toContain('emoji_v2')
  })

  test('noCountryFlags from NativeSupport.noCountryFlags() also filters flags', async () => {
    const { NativeSupport } = require('../helpers')
    NativeSupport.latestVersion.mockReturnValue(14)
    NativeSupport.noCountryFlags.mockReturnValue(true)

    const data = {
      categories: [{ id: 'flags', emojis: ['checkered_flag', 'flag_de'] }],
      emojis: {
        checkered_flag: {
          id: 'checkered_flag',
          name: 'Checkered Flag',
          keywords: ['racing'],
          skins: [{ unified: '1f3c1', native: '🏁' }],
          version: 1,
        },
        flag_de: {
          id: 'flag_de',
          name: 'Germany',
          keywords: ['german'],
          skins: [{ unified: '1f1e9-1f1ea', native: '🇩🇪' }],
          version: 1,
        },
      },
      aliases: {},
      sheet: { cols: 61, rows: 61 },
    }

    // noCountryFlags from NativeSupport (not from props)
    await config.init({ data, set: 'native' })

    const flagsCategory = config.Data.categories.find((c) => c.id === 'flags')
    expect(flagsCategory.emojis).toContain('checkered_flag')
    expect(flagsCategory.emojis).not.toContain('flag_de')
  })
})

// ─── getProps() ───────────────────────────────────────────────────────────────

describe('getProps()', () => {
  const defaultProps = {
    theme: { value: 'light' },
    size: { value: 24 },
    open: { value: true },
  }

  test('returns defaults when no props given', () => {
    const result = config.getProps({}, defaultProps, null)
    expect(result.theme).toBe('light')
    expect(result.size).toBe(24)
    expect(result.open).toBe(true)
  })

  test('overrides defaults with provided props', () => {
    const result = config.getProps(
      { theme: 'dark', size: 32 },
      defaultProps,
      null,
    )
    expect(result.theme).toBe('dark')
    expect(result.size).toBe(32)
    expect(result.open).toBe(true)
  })

  test('returns all keys from defaultProps', () => {
    const result = config.getProps({}, defaultProps, null)
    expect(Object.keys(result).sort()).toEqual(['open', 'size', 'theme'])
  })

  test('reads props from element attributes', () => {
    const element = {
      getAttribute: (name) => (name === 'theme' ? 'contrast' : null),
    }
    const result = config.getProps({}, defaultProps, element)
    expect(result.theme).toBe('contrast')
  })
})

// ─── getProp() ────────────────────────────────────────────────────────────────

describe('getProp()', () => {
  test('returns default value when prop is not provided', () => {
    const defaults = { count: { value: 5 } }
    const result = config.getProp('count', {}, defaults, null)
    expect(result).toBe(5)
  })

  test('returns provided value when present', () => {
    const defaults = { count: { value: 5 } }
    const result = config.getProp('count', { count: 10 }, defaults, null)
    expect(result).toBe(10)
  })

  test('coerces string "false" to boolean false when default is boolean', () => {
    const defaults = { open: { value: true } }
    const result = config.getProp('open', { open: 'false' }, defaults, null)
    expect(result).toBe(false)
  })

  test('type coercion only applies when default value is truthy', () => {
    // When default value is `false` (falsy), the coercion branch is skipped
    // because: `defaults.value && typeof defaults.value != typeof value`
    // evaluates to `false && ...` = false. The string 'true' is returned as-is.
    const defaults = { open: { value: false } }
    const result = config.getProp('open', { open: 'true' }, defaults, null)
    // value is returned unchanged when default is falsy and no choices/null check applies
    expect(result).toBe('true')
  })

  test('coerces string number to number when default is number', () => {
    const defaults = { size: { value: 24 } }
    const result = config.getProp('size', { size: '32' }, defaults, null)
    expect(result).toBe(32)
  })

  test('falls back to default when value not in choices', () => {
    const defaults = { theme: { value: 'light', choices: ['light', 'dark'] } }
    const result = config.getProp('theme', { theme: 'purple' }, defaults, null)
    expect(result).toBe('light')
  })

  test('accepts value when it is in choices', () => {
    const defaults = { theme: { value: 'light', choices: ['light', 'dark'] } }
    const result = config.getProp('theme', { theme: 'dark' }, defaults, null)
    expect(result).toBe('dark')
  })

  test('applies transform function on provided value', () => {
    // Use a string default so the type coercion step does not convert the value
    // before transform runs (array default would trigger Array('a,b,c') coercion)
    const defaults = {
      tags: {
        value: 'default',
        transform: (v) => v.toUpperCase(),
      },
    }
    const result = config.getProp('tags', { tags: 'hello' }, defaults, null)
    expect(result).toBe('HELLO')
  })

  test('reads value from element attribute', () => {
    const defaults = { theme: { value: 'light' } }
    const element = {
      getAttribute: (name) => (name === 'theme' ? 'dark' : null),
    }
    const result = config.getProp('theme', {}, defaults, element)
    expect(result).toBe('dark')
  })

  test('returns null value when no defaults provided', () => {
    const result = config.getProp('unknown', {}, {}, null)
    expect(result).toBeNull()
  })

  test('element attribute takes precedence over props', () => {
    const defaults = { theme: { value: 'light' } }
    const element = {
      getAttribute: (name) => (name === 'theme' ? 'contrast' : null),
    }
    const result = config.getProp('theme', { theme: 'dark' }, defaults, element)
    expect(result).toBe('contrast')
  })
})
