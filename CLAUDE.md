# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
# Install dependencies
yarn install

# Run all tests
yarn test

# Run a single test file
yarn jest packages/emoji-mart/src/__tests__/config.test.js

# Type check
yarn check:types

# Format check / fix
yarn prettier
yarn prettier:fix

# Build individual packages
yarn build          # emoji-mart (main library)
yarn build:data     # @emoji-mart/data
yarn build:react    # @emoji-mart/react
yarn build:vue      # @emoji-mart/vue
yarn build:website  # @emoji-mart/website

# Run dev server (website)
yarn dev
```

## Architecture

This is a Yarn workspaces monorepo with four packages under `packages/`:

| Directory | npm name | Role |
|---|---|---|
| `emoji-mart` | `emoji-mart` | Core library |
| `emoji-mart-data` | `@emoji-mart/data` | Emoji data sets + i18n JSON files |
| `emoji-mart-react` | `@emoji-mart/react` | Thin React wrapper |
| `emoji-mart-vue` | `@emoji-mart/vue` | Thin Vue 3 wrapper |
| `emoji-mart-website` | `@emoji-mart/website` | Demo site |

### Core library (`packages/emoji-mart/src/`)

Built with **Preact** (aliased as `react`/`react-dom` at bundle time via `package.json` `alias` field). Parcel handles the build, producing three targets: `main` (CJS), `module` (ESM), and `global` (browser UMD via `src/browser.js`).

**Key files:**

- `config.ts` — `init()` entry point. Loads data (inline or via fetch), processes emoji search indexes, handles custom emojis and category filtering. Data is a singleton; call `init()` once before rendering.
- `components/Picker/PickerElement.tsx` — Registers the `<em-emoji-picker>` Custom Element (Web Component) backed by a Shadow DOM. Calls `init()` then renders the Preact `<Picker>` into the shadow root.
- `components/Picker/Picker.tsx` — Main Preact picker component.
- `components/Picker/PickerProps.ts` — Canonical prop definitions with defaults and valid choices. Used both by the Web Component (attribute parsing) and the React wrapper.
- `components/Emoji/` — Standalone `<em-emoji>` Web Component for rendering a single emoji.
- `helpers/` — `SearchIndex`, `FrequentlyUsed`, `NativeSupport`, `SafeFlags`, `Store` — stateful singletons.
- `utils.ts` — `getEmojiDataFromNative()` for reverse-lookup from a native emoji character.

### Data package (`packages/emoji-mart-data/`)

Data is pre-built JSON files; `build.js` generates them from upstream sources (`emoji-datasource`, `emojilib`, etc.). Files are organized as:

- `sets/{version}/{set}.json` — One JSON per emoji version × set (native, apple, google, twitter, facebook, all)
- `i18n/{locale}.json` — Localization strings

The `main` field points to `sets/15/native.json` (latest version, native set).

### Prop resolution

`getProps()` / `getProp()` in `config.ts` merge three sources in priority order: HTML element attribute → explicit JS prop → `PickerProps` default. Type coercion and `choices` validation happen here.

### Testing

Jest with `jest-environment-jsdom`. `.js` files are transformed by a custom ESM transformer (`jest/esm-transformer.js`); TypeScript via `ts-jest`. Tests live in `packages/emoji-mart/src/__tests__/`.
