export type PickerCategory =
  | 'frequent'
  | 'people'
  | 'nature'
  | 'foods'
  | 'activity'
  | 'places'
  | 'objects'
  | 'symbols'
  | 'flags'

export type PickerTheme = 'auto' | 'light' | 'dark'

export interface PickerProps {
  /**
   * Data to use for the picker
   */
  data?: any

  /**
   * Localization data to use for the picker
   */
  i18n?: any

  /**
   * Categories to show in the picker. Order is respected.
   */
  categories?: PickerCategory[]

  /**
   * Custom emojis
   */
  custom?: any[]

  /**
   * Callback when an emoji is selected
   */
  onEmojiSelect?: (emojiData, e: MouseEvent) => void

  /**
   * Callback when a click outside of the picker happens
   */
  onClickOutside?: (e: MouseEvent) => void

  /**
   * Callback when the Add custom emoji button is clicked. The button will only be displayed if this callback is provided. It is displayed when search returns no results.
   */
  onAddCustomEmoji?: (e: MouseEvent) => void

  /**
   * Whether the picker should automatically focus on the search input
   */
  autoFocus?: boolean

  /**
   * Custom category icons
   */
  categoryIcons?: any

  /**
   * Whether the picker should calculate perLine dynamically based on the width of <em-emoji-picker>. When enabled, perLine is ignored
   */
  dynamicWidth?: boolean

  /**
   * An array of color that affects the hover background color
   */
  emojiButtonColors?: string[]

  /**
   * The radius of the emoji buttons
   */
  emojiButtonRadius?: string

  /**
   * The size of the emoji buttons
   */
  emojiButtonSize?: number

  /**
   * The size of the emojis (inside the buttons)
   */
  emojiSize?: number

  /**
   * The version of the emoji data to use. Latest version supported in @emoji-mart/data is currently 14
   */
  emojiVersion?: string

  /**
   * List of emoji IDs that will be excluded from the picker
   */
  exceptEmojis?: string[]

  /**
   * The type of icons to use for the picker. outline with light theme and solid with dark theme.
   */
  icons?: 'auto' | 'outline' | 'solid'

  /**
   * The locale to use for the picker
   */
  locale?: string

  /**
   * The maximum number of frequent rows to show. 0 will disable frequent category
   */
  maxFrequentRows?: number

  /**
   * The position of the navigation bar
   */
  navPosition?: 'top' | 'bottom' | 'none'

  /**
   * Whether to show country flags or not. If not provided, tbhis is handled automatically (Windows doesn’t support country flags)
   */
  noCountryFlags?: boolean

  /**
   * The id of the emoji to use for the no results emoji
   */
  noResultsEmoji?: string

  /**
   * The number of emojis to show per line
   */
  perLine?: number

  /**
   * The id of the emoji to use for the preview when not hovering any emoji. point_up when preview position is bottom and point_down when preview position is top.
   */
  previewEmoji?: string

  /**
   * The position of the preview
   */
  previewPosition?: 'top' | 'bottom' | 'none'

  /**
   * The position of the search input
   */
  searchPosition?: 'sticky' | 'static' | 'none'

  /**
   * The set of emojis to use for the picker. native being the most performant, others rely on spritesheets.
   */
  set?: 'native' | 'apple' | 'facebook' | 'google' | 'twitter'

  /**
   * The emojis skin tone
   */
  skin?: 1 | 2 | 3 | 4 | 5 | 6

  /**
   * The position of the skin tone selector
   */
  skinTonePosition?: 'preview' | 'search' | 'none'

  /**
   * The color theme of the picker
   */
  theme?: PickerTheme

  /**
   * A function that returns the URL of the spritesheet to use for the picker. It should be compatible with the data provided.
   */
  getSpritesheetURL?: (set: string) => string
}

export const defaultPickerProps = {
  autoFocus: {
    value: false,
  },
  dynamicWidth: {
    value: false,
  },
  emojiButtonColors: {
    value: null,
  },
  emojiButtonRadius: {
    value: '100%',
  },
  emojiButtonSize: {
    value: 36,
  },
  emojiSize: {
    value: 24,
  },
  emojiVersion: {
    value: 14,
    choices: [1, 2, 3, 4, 5, 11, 12, 12.1, 13, 13.1, 14],
  },
  exceptEmojis: {
    value: [],
  },
  icons: {
    value: 'auto',
    choices: ['auto', 'outline', 'solid'],
  },
  locale: {
    value: 'en',
    choices: [
      'en',
      'ar',
      'be',
      'cs',
      'de',
      'es',
      'fa',
      'fi',
      'fr',
      'hi',
      'it',
      'ja',
      'kr',
      'nl',
      'pl',
      'pt',
      'ru',
      'sa',
      'tr',
      'uk',
      'vi',
      'zh',
    ],
  },
  maxFrequentRows: {
    value: 4,
  },
  navPosition: {
    value: 'top',
    choices: ['top', 'bottom', 'none'],
  },
  noCountryFlags: {
    value: false,
  },
  noResultsEmoji: {
    value: null,
  },
  perLine: {
    value: 9,
  },
  previewEmoji: {
    value: null,
  },
  previewPosition: {
    value: 'bottom',
    choices: ['top', 'bottom', 'none'],
  },
  searchPosition: {
    value: 'sticky',
    choices: ['sticky', 'static', 'none'],
  },
  set: {
    value: 'native',
    choices: ['native', 'apple', 'facebook', 'google', 'twitter'],
  },
  skin: {
    value: 1,
    choices: [1, 2, 3, 4, 5, 6],
  },
  skinTonePosition: {
    value: 'preview',
    choices: ['preview', 'search', 'none'],
  },
  theme: {
    value: 'auto',
    choices: ['auto', 'light', 'dark'],
  },

  // Data
  categories: null,
  categoryIcons: null,
  custom: null,
  data: null,
  i18n: null,

  // Callbacks
  getImageURL: null,
  getSpritesheetURL: null,
  onAddCustomEmoji: null,
  onClickOutside: null,
  onEmojiSelect: null,

  // Deprecated
  stickySearch: {
    deprecated: true,
    value: true,
  },
}
