// @ts-nocheck
import React, { useEffect, useRef } from 'react'
import { Picker } from 'emoji-mart'

export default function EmojiPicker(props) {
  const ref = useRef(null)
  const instance = useRef(null)

  if (instance.current) {
    instance.current.update(props)
  }

  useEffect(() => {
    const PickerElement = window?.customElements.get('em-emoji-picker')
    instance.current = new (PickerElement || Picker)({ ...props, ref })

    return () => {
      instance.current = null
    }
  }, [])

  return React.createElement('div', { ref })
}
