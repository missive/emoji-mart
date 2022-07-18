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
  it('treats 0 arguments the same as an empty options object', async () => {
    const result0 = await init()
    const result1 = await init({})

    expect(result0).toEqual(result1)
    expect(result0.autoFocus).toBe(false)
    expect(result0.theme).toBe('auto')
  })
})
