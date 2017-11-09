import emojiIndex from '../src/utils/emoji-index'

describe('#emojiIndex', () => {
  describe('search', function() {
    it('should work', () => {
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

    it('should filter only emojis we care about, exclude pineapple', () => {
      let emojisToShowFilter = data => {
        data.unified !== '1F34D'
      }
      expect(
        emojiIndex.search('apple', { emojisToShowFilter }).map(obj => obj.id)
      ).not.toContain('pineapple')
    })

    it('can include/exclude categories', () => {
      expect(emojiIndex.search('flag', { include: ['people'] })).toEqual([])
    })

    it('can search for thinking_face', () => {
      expect(emojiIndex.search('thinking_fac').map(x => x.id)).toEqual([
        'thinking_face',
      ])
    })

    it('can search for woman-facepalming', () => {
      expect(emojiIndex.search('woman-facep').map(x => x.id)).toEqual([
        'woman-facepalming',
      ])
    })
  })
})
