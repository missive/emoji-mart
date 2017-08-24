var NAMESPACE = 'emoji-mart'

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
  try {
    window.localStorage[`${NAMESPACE}.${key}`] = JSON.stringify(value)
  } catch (e) {
  }
}

function get(key) {
  if (!isLocalStorageSupported) return
  try {
    var value = window.localStorage[`${NAMESPACE}.${key}`]
  } catch (e) {
    return
  }

  if (value) {
    return JSON.parse(value)
  }
}

function setNamespace(namespace) {
  NAMESPACE = namespace
}

export default { update, set, get, setNamespace }
