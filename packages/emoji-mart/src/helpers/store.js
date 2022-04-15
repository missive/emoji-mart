function set(key, value) {
  try {
    window.localStorage[`emoji-mart.${key}`] = JSON.stringify(value)
  } catch (error) {}
}

function get(key) {
  try {
    const value = window.localStorage[`emoji-mart.${key}`]

    if (value) {
      return JSON.parse(value)
    }
  } catch (error) {}
}

export default { set, get }
