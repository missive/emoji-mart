const NAMESPACE = 'emoji-mart'

var isLocalStorageSupported = typeof window !== 'undefined' &&
                              'localStorage' in window

function update(state) {
  for (let key in state) {
    let value = state[key]
    set(key, value)
  }
}

function set(key, value) {
  if (!isLocalStorageSupported) return
  window.localStorage[`${NAMESPACE}.${key}`] = JSON.stringify(value)
}

function get(key) {
  if (!isLocalStorageSupported) return
  var value = window.localStorage[`${NAMESPACE}.${key}`]

  if (value) {
    return JSON.parse(value)
  }
}

export default { update, set, get }
