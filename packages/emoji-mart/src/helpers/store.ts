/**
 * Retrieves a stored value by key.
 * @param key - The key of the stored value.
 * @returns The retrieved value.
 */
function set(key: string, value: any) {
  try {
    window.localStorage[`emoji-mart.${key}`] = JSON.stringify(value)
  } catch (error) {}
}

/**
 * Stores a value under a specific key.
 * @param key - The key to store the value under.
 * @param value - The value to store.
 */
function get(key: string): any {
  try {
    const value = window.localStorage[`emoji-mart.${key}`]

    if (value) {
      return JSON.parse(value)
    }
  } catch (error) {}
}

export default { set, get }
