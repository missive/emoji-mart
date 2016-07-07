import {store} from '.'

let frequently = store.get('frequently') || {}

function add(emoji) {
  var { id } = emoji

  frequently[id] || (frequently[id] = 0)
  frequently[id] += 1

  store.set('last', id)
  store.set('frequently', frequently)
}

function get(quantity) {
  var sorted = Object.keys(frequently).sort((a, b) => frequently[a] - frequently[b]).reverse(),
      sliced = sorted.slice(0, quantity),
      last = store.get('last')

  if (last && sliced.indexOf(last) == -1) {
    sliced.pop()
    sliced.push(last)
  }

  return sliced
}

export default { add, get }
