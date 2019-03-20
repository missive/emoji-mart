import emojiIndex from '../emoji-index.js'

test('should work', () => {
  expect(emojiIndex.search('pineapple')).toEqual([
    {
      id: 'pineapple',
      name: 'Pineapple',
      colons: ':pineapple:',
      emoticons: [],
      unified: '1f34d',
      skin: null,
      native: '🍍',
    },
  ])
})

test('should filter only emojis we care about, exclude pineapple', () => {
  let emojisToShowFilter = (data) => {
    data.unified !== '1F34D'
  }
  expect(
    emojiIndex.search('apple', { emojisToShowFilter }).map((obj) => obj.id),
  ).not.toContain('pineapple')
})

test('can include/exclude categories', () => {
  expect(emojiIndex.search('flag', { include: ['people'] })).toEqual([])
})

test('can search for thinking_face', () => {
  expect(emojiIndex.search('thinking_fac').map((x) => x.id)).toEqual([
    'thinking_face',
  ])
})

test('can search for woman-facepalming', () => {
  expect(emojiIndex.search('woman-facep').map((x) => x.id)).toEqual([
    'woman-facepalming',
  ])
})
