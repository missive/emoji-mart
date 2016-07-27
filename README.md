<h1 align="center">🏬 Emoji Mart</h1>

```jsx
import {Picker} from 'emoji-mart'

<Picker
  emojiSize={24}
  perLine={9}
  sheetURL='images/sheet-apple-64.png'
  onClick={(emoji) => console.log(emoji)}
/>

/*
{
  colons: ':smiley:',
  emoticons: [
    '=)',
    '=-)'
  ],
  id: 'smiley',
  name: 'Smiling Face with Open Mouth',
  native: '😃',
  skin: 1
}
*/
```
