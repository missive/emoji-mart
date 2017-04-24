import store from './store'

const DEFAULTS = [
  '+1',
  'grinning',
  'kissing_heart',
  'heart_eyes',
  'laughing',
  'stuck_out_tongue_winking_eye',
  'sweat_smile',
  'joy',
  'scream',
  'disappointed',
  'unamused',
  'weary',
  'sob',
  'sunglasses',
  'heart',
  'poop',
]

let frequently = store.get('frequently')

function add(emoji) {
  var { id } = emoji

  frequently || (frequently = {})
  frequently[id] || (frequently[id] = 0)
  frequently[id] += 1

  store.set('last', id)
  store.set('frequently', frequently)
}

function get(perLine) {
  if (!frequently) {
    frequently = {}

    Array(perLine).fill('').forEach((_, i) => {
      frequently[DEFAULTS[i]] = perLine - i
    })
  }

  var quantity = perLine * 4,
      sorted = Object.keys(frequently).sort((a, b) => frequently[a] - frequently[b]).reverse(),
      sliced = sorted.slice(0, quantity),
      last = store.get('last')

  if (last && sliced.indexOf(last) == -1) {
    sliced.pop()
    sliced.push(last)
  }

  return sliced
}

export default { add, get }
