export interface EmojiMartData {
  categories: Category[]
  emojis: { [key: string]: Emoji }
  aliases: { [key: string]: string }
  sheet: Sheet
}

export interface Category {
  id: string
  emojis: string[]
}

export interface Emoji {
  id: string
  name: string
  keywords: string[]
  skins: Skin[]
  version: number
  emoticons?: string[]
}

export interface Skin {
  unified: string
  native: string
  x?: number
  y?: number
}

export interface Sheet {
  cols: number
  rows: number
}
