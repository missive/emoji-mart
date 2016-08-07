const NAMESPACE = 'emoji-mart'

function update(state) {
  for (let key in state) {
    let value = state[key]
    set(key, value)
  }
}

function set(key, value) {
  if (!window || !('localStorage' in window)) return
  window.localStorage[`${NAMESPACE}.${key}`] = JSON.stringify(value)
}

function get(key) {
  if (!window || !('localStorage' in window)) return

  var value = window.localStorage[`${NAMESPACE}.${key}`]

  if (value) {
    return JSON.parse(value)
  }
}

export default { update, set, get }
