<div align="center">
  <br><b>Emoji Mart</b> is a customizable<br>emoji picker HTML component for the web
  <br><a href="https://missiveapp.com/open/emoji-mart">Demo</a>
  <br><br><a href="https://missiveapp.com/open/emoji-mart"><img width="639" alt="EmojiMart" src="https://user-images.githubusercontent.com/436043/163686169-766ef715-89b5-4ada-88d7-672623713bc0.png"></a>
  <br><br><a title="Team email, team chat, team tasks, one app" href="https://missiveapp.com"><img width="34" alt="Missive | Team email, team chat, team tasks, one app" src="https://user-images.githubusercontent.com/436043/163655413-df22f8cc-99a7-4d8d-a5c1-105c435910d7.png"></a>
  <br>Brought to you by the <a title="Team email, team chat, team tasks, one app" href="https://missiveapp.com">Missive</a> team
</div>

## 💾 Data

Data required for the picker to work has been completely decoupled from the library. That gives developers the flexibility to better control their app bundle size and let them choose how and when this data is loaded. Data can be:

### Bundled directly into your codebase
**Pros:** Picker renders instantly, data is available offline<br>
**Cons:** Slower initial page load (bigger file to load)

```sh
npm install @emoji-mart/data
```

```js
import data from '@emoji-mart/data'
import { Picker } from 'emoji-mart'

new Picker({ data })
```

### Fetched remotely
**Pros:** Data fetched only when needed, does not affect your app bundle size<br>
**Cons:** Network latency, doesn’t work offline (unless you configure a ServiceWorker)

```js
import { Picker } from 'emoji-mart'
new Picker({
  data: async () => {
    const response = await fetch(
      'https://cdn.jsdelivr.net/npm/@emoji-mart/data',
    )

    return response.json()
  }
})
```

In this example data is fetched from a content delivery network, but it could also be fetched from your own domain if you want to host the data.

## 🧑‍💻 Usage

### React
```sh
npm install --save emoji-mart @emoji-mart/data
```

```js
import React, { useEffect, useRef } from 'react'
import { render } from 'react-dom'

import data from '@emoji-mart/data'
import { Picker } from 'emoji-mart'

function EmojiPicker(props) {
  const ref = useRef()

  useEffect(() => {
    new Picker({ ...props, data, ref })
  }, [])

  return <div ref={ref} />
}

render(<EmojiPicker onEmojiSelect={console.log} />, document.querySelector('#picker'))
```

### Browser
```html
<script type="module">
  import data from 'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
  import * as EmojiMart from 'https://cdn.jsdelivr.net/npm/emoji-mart@latest/dist/index.js'

  const picker = new EmojiMart.Picker({ data, onEmojiSelect: console.log })
  document.querySelector('#picker').appendChild(picker)
</script>
```

## 🗺 Internationalization
EmojiMart UI supports [multiple languages](https://github.com/missive/emoji-mart/tree/main/packages/emoji-mart-data/i18n), feel free to open a PR if yours is missing.

```js
import i18n from '@emoji-mart/data/i18n/fr.json'
i18n.search_no_results_1 = 'Aucun emoji'

new Picker({ i18n })
```

Given the small file size, English is built-in and doesn’t need to be provided.

## 📚 Documentation

Coming soon. See [examples](https://missiveapp.com/open/emoji-mart/examples) for now.

## 🤓 Built for modern browsers
EmojiMart relies on these APIs, you may need to include polyfills if you need to support older browsers:
- [Shadow DOM](https://caniuse.com/shadowdomv1) ([MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM))
- [Custom elements](https://caniuse.com/custom-elementsv1) ([MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements))
- [IntersectionObserver](https://caniuse.com/intersectionobserver) ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API))
- [Async/Await](https://caniuse.com/async-functions) ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function))

## 🛠 Development
```sh
yarn install
yarn dev
```
