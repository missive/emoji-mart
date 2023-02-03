// @ts-nocheck
import React, { useEffect, useRef } from 'react'
import { Picker, PickerProps } from 'emoji-mart'

export default function EmojiPicker(props: PickerProps) {
  const ref = useRef(null)
  const instance = useRef(null)

  if (instance.current) {
    instance.current.update(props)
  }

  useEffect(() => {
    instance.current = new Picker({ ...props, ref })

    return () => {
      instance.current = null
    }
  }, [])

  return React.createElement('div', { ref })
}
