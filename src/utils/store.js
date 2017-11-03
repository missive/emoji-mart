var NAMESPACE = 'emoji-mart'

const _JSON = JSON

var isLocalStorageSupported =
  typeof window !== 'undefined' && 'localStorage' in window

let getter
let setter

function setHandlers(handlers) {
  handlers || (handlers = {})

  getter = handlers.getter
  setter = handlers.setter
}

function setNamespace(namespace) {
  NAMESPACE = namespace
}

function update(state) {
  for (let key in state) {
    let value = state[key]
    set(key, value)
  }
}

function set(key, value) {
  if (setter) {
    setter(key, value)
  } else {
    if (!isLocalStorageSupported) return
    try {
      window.localStorage[`${NAMESPACE}.${key}`] = _JSON.stringify(value)
    } catch (e) {}
  }
}

function get(key) {
  if (getter) {
    return getter(key)
  } else {
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
}

export default { update, set, get, setNamespace, setHandlers }
