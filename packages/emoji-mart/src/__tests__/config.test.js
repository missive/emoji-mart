import { init } from '../config'
import fetch, { Headers, Request, Response } from 'node-fetch'
import { TextDecoder } from 'util'

if (!globalThis.fetch) {
  globalThis.fetch = fetch
  globalThis.Headers = Headers
  globalThis.Request = Request
  globalThis.Response = Response

  globalThis.TextDecoder = TextDecoder
}

describe('init', () => {
  it('is not a no-op when 0 arguments are passed', async () => {
    const result = await init()

    expect(result.autoFocus).toBe(false)
    expect(result.theme).toBe('auto')
  })
})
