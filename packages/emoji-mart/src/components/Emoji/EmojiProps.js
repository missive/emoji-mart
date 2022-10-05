import PickerProps from '../Picker/PickerProps'

export default {
  fallback: '',
  id: '',
  native: '',
  shortcodes: '',
  size: {
    value: '',
    transform: (value) => {
      // If the value is a number, then we assume it’s a pixel value.
      if (!/\D/.test(value)) {
        return `${value}px`
      }

      return value
    },
  },

  imageURL: null,
  spritesheetURL: null,
  spritesheet: null,

  // Shared
  set: PickerProps.set,
  skin: PickerProps.skin,
}
