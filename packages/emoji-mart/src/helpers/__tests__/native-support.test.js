import NativeSupport from '../native-support'

describe('NativeSupport (jsdom default)', () => {
  describe('latestVersion()', () => {
    test('returns undefined in jsdom environment (no canvas emoji support)', () => {
      expect(NativeSupport.latestVersion()).toBeUndefined()
    })

    test('returns the same value on repeated calls (cached)', () => {
      const first = NativeSupport.latestVersion()
      const second = NativeSupport.latestVersion()
      expect(first).toBe(second)
    })
  })

  describe('noCountryFlags()', () => {
    test('returns true in jsdom environment (country flag emoji not supported)', () => {
      expect(NativeSupport.noCountryFlags()).toBe(true)
    })

    test('returns the same value on repeated calls (cached)', () => {
      const first = NativeSupport.noCountryFlags()
      const second = NativeSupport.noCountryFlags()
      expect(first).toBe(second)
    })
  })

  describe('exported interface', () => {
    test('exports latestVersion function', () => {
      expect(typeof NativeSupport.latestVersion).toBe('function')
    })

    test('exports noCountryFlags function', () => {
      expect(typeof NativeSupport.noCountryFlags).toBe('function')
    })

    test('does not export isSupported or isEmojiSupported (private helpers)', () => {
      expect(NativeSupport.isSupported).toBeUndefined()
      expect(NativeSupport.isEmojiSupported).toBeUndefined()
    })
  })
})

describe('NativeSupport (mocked canvas)', () => {
  let originalUserAgent

  beforeAll(() => {
    originalUserAgent = navigator.userAgent
  })

  afterAll(() => {
    // Restore original userAgent
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    })
  })

  function loadWithCanvas(mockCtx) {
    // Override userAgent to not include 'jsdom' so the IIFE takes the canvas path
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 TestBrowser',
      configurable: true,
    })

    // Mock canvas getContext to return our mock context
    const origCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'canvas') {
        return {
          getContext: () => mockCtx,
          width: 0,
          height: 0,
        }
      }
      return origCreateElement(tag)
    })

    // Reset module cache so the IIFE re-runs with our mocks
    jest.resetModules()
    const mod = require('../native-support').default

    // Restore createElement (the IIFE has already captured ctx)
    document.createElement.mockRestore()

    return mod
  }

  function createMockCtx({ supported = true, multiChar = false } = {}) {
    // Build pixel data that simulates emoji rendering
    // The detection draws the same emoji in red (left) and blue (right)
    // and checks: (1) visible pixels exist, (2) colors match (emoji has its own color),
    // (3) width < CANVAS_WIDTH (not a multi-character fallback)

    const CANVAS_WIDTH = 20
    const CANVAS_HEIGHT = 25

    // For a supported emoji: pixel is visible (alpha > 0) and same color in both draws
    // For unsupported: either no visible pixel, colors differ, or too wide
    const makeImageData = (isLeftSide) => {
      const data = new Uint8ClampedArray(CANVAS_WIDTH * CANVAS_HEIGHT * 4)
      if (supported) {
        // Put a visible pixel at position (2, 0) — index 8
        // Same RGB in both left and right draws (emoji has inherent color)
        const idx = 8
        data[idx] = 200 // R
        data[idx + 1] = 150 // G
        data[idx + 2] = 50 // B
        data[idx + 3] = 255 // A (visible)
      }
      // If not supported: all alpha=0, so "no visible pixel" path triggers
      return { data }
    }

    return {
      font: '',
      textBaseline: '',
      canvas: { width: 0, height: 0 },
      fillStyle: '',
      clearRect: jest.fn(),
      fillText: jest.fn(),
      getImageData: jest.fn().mockImplementation((x, y, w, h) => {
        if (w === CANVAS_WIDTH) {
          // Full-width read (left side check for first visible pixel)
          return makeImageData(true)
        }
        // 1x1 pixel read (right side comparison)
        const data = new Uint8ClampedArray(4)
        if (supported) {
          data[0] = 200 // R — matches left side
          data[1] = 150 // G
          data[2] = 50 // B
          data[3] = 255 // A
        }
        return { data }
      }),
      measureText: jest.fn().mockReturnValue({
        width: multiChar ? 25 : 10, // >= CANVAS_WIDTH means multi-char (unsupported)
      }),
    }
  }

  test('latestVersion returns highest version when all emojis are supported', () => {
    const ctx = createMockCtx({ supported: true })
    const NS = loadWithCanvas(ctx)

    expect(NS.latestVersion()).toBe(15)
  })

  test('noCountryFlags returns false when flag emoji is supported', () => {
    const ctx = createMockCtx({ supported: true })
    const NS = loadWithCanvas(ctx)

    expect(NS.noCountryFlags()).toBe(false)
  })

  test('latestVersion returns undefined when no emoji is supported', () => {
    const ctx = createMockCtx({ supported: false })
    const NS = loadWithCanvas(ctx)

    expect(NS.latestVersion()).toBeUndefined()
  })

  test('noCountryFlags returns true when flag emoji is not supported', () => {
    const ctx = createMockCtx({ supported: false })
    const NS = loadWithCanvas(ctx)

    expect(NS.noCountryFlags()).toBe(true)
  })

  test('emoji is rejected when measureText width >= CANVAS_WIDTH (multi-char fallback)', () => {
    const ctx = createMockCtx({ supported: true, multiChar: true })
    const NS = loadWithCanvas(ctx)

    // All emojis appear as multi-char (too wide), so none are supported
    expect(NS.latestVersion()).toBeUndefined()
  })

  test('emoji is rejected when left/right pixel colors differ', () => {
    const ctx = createMockCtx({ supported: true })
    // Override the 1x1 getImageData to return different colors
    const origGetImageData = ctx.getImageData
    ctx.getImageData = jest.fn().mockImplementation((x, y, w, h) => {
      if (w === 20) {
        return origGetImageData(x, y, w, h)
      }
      // Right-side pixel has different color — means emoji took on fillStyle color
      // (not a real emoji with inherent color)
      return { data: new Uint8ClampedArray([100, 150, 200, 255]) }
    })
    const NS = loadWithCanvas(ctx)

    expect(NS.latestVersion()).toBeUndefined()
  })

  test('caches results — same emoji is only checked once', () => {
    const ctx = createMockCtx({ supported: true })
    const NS = loadWithCanvas(ctx)

    NS.latestVersion()
    const callCount1 = ctx.fillText.mock.calls.length

    // Second call should use cache, no new fillText calls
    NS.latestVersion()
    const callCount2 = ctx.fillText.mock.calls.length

    expect(callCount2).toBe(callCount1)
  })

  test('clearRect is called before each emoji test', () => {
    const ctx = createMockCtx({ supported: false })
    const NS = loadWithCanvas(ctx)

    NS.latestVersion()
    // Should have been called once per emoji version checked (12 versions)
    expect(ctx.clearRect).toHaveBeenCalledTimes(12)
  })

  test('fillText is called twice per emoji (red left, blue right)', () => {
    const ctx = createMockCtx({ supported: false })
    const NS = loadWithCanvas(ctx)

    NS.latestVersion()
    // 12 versions × 2 draws each = 24
    expect(ctx.fillText).toHaveBeenCalledTimes(24)
  })
})
