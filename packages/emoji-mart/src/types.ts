export interface EmojiDataCategory {
  id: string
  emojis: string[]
}

export interface EmojiDataItem {
  id: string
  keywords: string[]
  name: string
  skins: { unified: string; native: string }[]
  version: number
}

export interface EmojiData {
  aliases: Record<string, string>
  categories: EmojiDataCategory[]
  emojis: Record<string, EmojiDataItem>
  sheet: {
    cols: number
    rows: number
  }
}
