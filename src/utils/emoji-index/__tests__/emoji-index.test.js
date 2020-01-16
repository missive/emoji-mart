import emojiIndex from '../emoji-index.js'

test('should work', () => {
  expect(emojiIndex.search('pineapple')).toEqual([
    {
      id: 'pineapple',
      name: 'Pineapple',
      short_names: ['pineapple'],
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

test('emojiIndex exports emojis', () => {
  const emojis = emojiIndex.emojis
  expect(emojis['thinking_face'].native).toEqual('\ud83e\udd14')
})

test('emojiIndex exports emoticons', () => {
  const emoticons = emojiIndex.emoticons
  expect(emoticons[':)']).toEqual('slightly_smiling_face')
})
