# `@agilemile/emoji-mart-react`

A React wrapper for [EmojiMart](https://missiveapp.com/open/emoji-mart).

## 🧑‍💻 Usage
```sh
npm install --save @agilemile/emoji-mart @agilemile/emoji-mart-data @agilemile/emoji-mart-react
```

```js
import data from '@agilemile/emoji-mart-data'
import Picker from '@agilemile/emoji-mart-react'

function App() {
  return (
    <Picker data={data} onEmojiSelect={console.log} />
  )
}
```

## 📚 Documentation
See https://github.com/missive/emoji-mart#react
