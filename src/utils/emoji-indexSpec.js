import emojiIndex from './emoji-index';

describe('#emojiIndex', () => {
  describe('search', function() {
    it('should work', () => {
      expect(emojiIndex.search('pineapple')).toEqual([{
        id: 'pineapple',
        name: 'Pineapple',
        colons: ':pineapple:',
        emoticons: [  ],
        skin: null,
        native: '🍍'
      }]);
    });

    it('should filter only emojis we care about, exclude pineapple', () => {
      let emojisToShowFilter = (unified) => unified !== '1F34D';
      expect(emojiIndex.search('apple', emojisToShowFilter).map((obj) => obj.id))
        .not.toContain('pineapple');
    });
  });
});
