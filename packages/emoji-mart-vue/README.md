# `@emoji-mart/vue`

A Vue 3 wrapper for [EmojiMart](https://missiveapp.com/open/emoji-mart).

## 🧑‍💻 Usage

```sh
npm install --save emoji-mart @emoji-mart/data @emoji-mart/vue
```

```vue
<script setup>
import data from '@emoji-mart/data'
import EmojiPicker from '@emoji-mart/vue'
</script>

<template>
  <EmojiPicker :data="data" @emoji-select="console.log" />
</template>
```

## 📚 Documentation

See https://github.com/missive/emoji-mart
