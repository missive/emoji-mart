<div align="center">
  <br><b>Emoji Mart</b> is a Slack-like customizable<br>emoji picker component for React
  <br>[<a href="https://missive.github.io/emoji-mart">Demo</a>]
  <br><img src="https://cloud.githubusercontent.com/assets/436043/17186519/9e71e8fe-5403-11e6-9314-21365c56a601.png">
  <br><a title="Team email, team chat, team tasks, one app" href="https://missiveapp.com"><img alt="Missive | Team email, team chat, team tasks, one app" src="https://cloud.githubusercontent.com/assets/436043/17186909/17f9cede-5405-11e6-988a-a7c2380af396.png"></a>
  <br>Brought to you by the <a title="Team email, team chat, team tasks, one app" href="https://missiveapp.com">Missive</a> team
</div>

## Components
### Picker
```jsx
import { Picker } from 'emoji-mart'

<Picker set='emojione' />
<Picker onClick={this.addEmoji} />
<Picker title='Pick your emoji…' emoji='point_up' />
<Picker style={{ position: 'absolute', bottom: '20px', right: '20px' }} />
<Picker i18n={{ search: 'Recherche', categories: { search: 'Résultats de recherche', recent: 'Récents' } }} />
```

| Prop | Required | Default | Description |
| ---- | :------: | ------- | ----------- |
| **color** | | `#ae65c5` | The top bar anchors select and hover color |
| **emoji** | | `department_store` | The emoji shown when no emojis are hovered |
| **emojiSize** | | `24` | The emoji width and height |
| **onClick** | | | Params: `(emoji, event) => {}` |
| **perLine** | | `9` | Number of emojis per line. While there’s no minimum or maximum, this will affect the picker’s width. This will set *Frequently Used* length as well (`perLine * 4`) |
| **i18n** | | [`{…}`](#i18n) | [An object](#i18n) containing localized strings |
| **set** | | `apple` | The emoji set: `'apple', 'google', 'twitter', 'emojione'` |
| **sheetSize** | | `64` | The emoji [sheet size](#sheet-sizes): `16, 20, 32, 64` |
| **backgroundImageFn** | | ```((set, sheetSize) => `https://unpkg.com/emoji-datasource@2.4.4/sheet_${set}_${sheetSize}.png`)``` | A Fn that returns that image sheet to use for emojis. Useful for avoiding a request if you have the sheet locally. |
| **skin** | | `1` | Default skin color: `1, 2, 3, 4, 5, 6` |
| **style** | | | Inline styles applied to the root element. Useful for positioning |
| **title** | | `Emoji Mart™` | The title shown when no emojis are hovered |

#### I18n
```js
search: 'Search',
categories: {
  search: 'Search Results',
  recent: 'Frequently Used',
  people: 'Smileys & People',
  nature: 'Animals & Nature',
  foods: 'Food & Drink',
  activity: 'Activity',
  places: 'Travel & Places',
  objects: 'Objects',
  symbols: 'Symbols',
  flags: 'Flags',
}
```

#### Sheet sizes
Sheets are served from [unpkg](https://unpkg.com), a global CDN that serves files published to [npm](https://www.npmjs.com).

| Set      | sheetSize | Size     |
| -------- | --------- | -------- |
| apple    | 16        | 938.7 kB |
| apple    | 20        | 1.3 MB   |
| apple    | 32        | 2.6 MB   |
| apple    | 64        | 7.2 MB   |
| emojione | 16        | 805.5 kB |
| emojione | 20        | 1.1 MB   |
| emojione | 32        | 2.0 MB   |
| emojione | 64        | 2.7 MB   |
| google   | 16        | 622.6 kB |
| google   | 20        | 849.8 kB |
| google   | 32        | 1.6 MB   |
| google   | 64        | 3.6 MB   |
| twitter  | 16        | 776.0 kB |
| twitter  | 20        | 1.0 MB   |
| twitter  | 32        | 1.9 MB   |
| twitter  | 64        | 4.2 MB   |

#### Examples of `emoji` object:
```js
{
  id: 'smiley',
  name: 'Smiling Face with Open Mouth',
  colons: ':smiley:',
  emoticons: [
    '=)',
    '=-)'
  ],
  skin: null,
  native: '😃'
}

{
  id: 'santa',
  name: 'Father Christmas',
  colons: ':santa::skin-tone-3:',
  emoticons: [],
  skin: 3,
  native: '🎅🏼'
}
```

### Emoji
```jsx
import { Emoji } from 'emoji-mart'

<Emoji emoji={{ id: 'santa', skin: 3 }} />
<Emoji emoji=':santa::skin-tone-3:' />
<Emoji emoji='santa' set='emojione' />
```

| Prop | Required | Default | Description |
| ---- | :------: | ------- | ----------- |
| **emoji** | ✓ | | Either a string or an `emoji` object |
| **size** | ✓ | | The emoji width and height. |
| **native** | | `false` | Renders the native unicode emoji |
| **onClick** | | | Params: `(emoji, event) => {}` |
| **onLeave** | | | Params: `(emoji, event) => {}` |
| **onOver** | | | Params: `(emoji, event) => {}` |
| **set** | | `apple` | The emoji set: `'apple', 'google', 'twitter', 'emojione'` |
| **sheetSize** | | `64` | The emoji [sheet size](#sheet-sizes): `16, 20, 32, 64` |
| **backgroundImageFn** | | ```((set, sheetSize) => `https://unpkg.com/emoji-datasource@2.4.4/sheet_${set}_${sheetSize}.png`)``` | A Fn that returns that image sheet to use for emojis. Useful for avoiding a request if you have the sheet locally. |
| **skin** | | `1` | Skin color: `1, 2, 3, 4, 5, 6` |

## Headless search
The `Picker` doesn’t have to be mounted for you to take advantage of the advanced search results.

```js
import { emojiIndex } from 'emoji-mart'

emojiIndex.search('christmas').map((o) => o.native)
// => [🎄, 🎅🏼, 🔔, 🎁, ⛄️, ❄️]
```

## Features
### Powerful search
#### Short name, name and keywords
Not only does **Emoji Mart** return more results than most emoji picker, they’re more accurate and sorted by relevance.

![sun-results](https://cloud.githubusercontent.com/assets/436043/17188668/25d21028-540c-11e6-93e7-9decd6130f08.png)

#### Emoticons
The only emoji picker that returns emojis when searching for emoticons.

![emoticon-results](https://cloud.githubusercontent.com/assets/436043/17188671/28ce7000-540c-11e6-9492-99f037480eb6.png)

#### Results intersection
For better results, **Emoji Mart** split search into words and only returns results matching both terms.

![highfive-results](https://cloud.githubusercontent.com/assets/436043/17188674/2c47d014-540c-11e6-925b-dfbdea517a65.png)

### Fully customizable
#### Anchors color, title and default emoji
![anchors](https://cloud.githubusercontent.com/assets/436043/17187575/d245c796-5407-11e6-8b90-6f988b058b9b.png)<br>
![pick](https://cloud.githubusercontent.com/assets/436043/17187576/d2537bac-5407-11e6-9a05-ba20cd0f374d.png)

#### Emojis sizes and length
![sizes](https://cloud.githubusercontent.com/assets/436043/17189912/bff094fe-5411-11e6-95d0-2030f238b24f.png)

#### Default skin color
As the developer, you have control over which skin color is used by default.

![skins](https://cloud.githubusercontent.com/assets/436043/17221380/aa029d30-54c1-11e6-867c-772847aa5b7b.png)

It can however be overwritten as per user preference.

![colors](https://cloud.githubusercontent.com/assets/436043/17221637/9f6f8508-54c2-11e6-8d10-59c5d3a458e0.png)

#### Multiple sets supported
Apple / Google / Twitter / EmojiOne

![sets](https://cloud.githubusercontent.com/assets/436043/17221550/4261d64a-54c2-11e6-8c49-a5c4c4696f8b.png)

## Not opinionated
**Emoji Mart** doesn’t automatically insert anything into a text input, nor does it show or hide itself. It simply returns an `emoji` object. It’s up to the developer to mount/unmount (it’s fast!) and position the picker. You can use the returned object as props for the `EmojiMart.Emoji` component. You could also use `emoji.colons` to insert text into a textarea or `emoji.native` to use the emoji.

## Development
```sh
$ npm run build:data
$ npm run watch
$ open example/index.html
```

## 🎩 Hat tips!
Powered by [iamcal/emoji-data](https://github.com/iamcal/emoji-data) and inspired by [iamcal/js-emoji](https://github.com/iamcal/js-emoji).<br>
🙌🏼  [Cal Henderson](https://github.com/iamcal).

<br><br>
<div align="center">
  <a title="Team email, team chat, team tasks, one app" href="https://missiveapp.com"><img alt="Missive | Team email, team chat, team tasks, one app" src="https://cloud.githubusercontent.com/assets/436043/17222476/7fb2ef62-54c6-11e6-81a9-6b9d7323d19c.png"></a>
  <br><a title="Team email, team chat, team tasks, one app" href="https://missiveapp.com">Missive</a> mixes team email and threaded group chat for productive teams.
  <br>A single app for all your internal and external communication and a full work management solution.
</div>
