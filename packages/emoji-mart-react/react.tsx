// @ts-nocheck
import React, { useEffect, useRef } from 'react'
import { Emoji, Picker } from 'emoji-mart'

export default function EmojiPicker(props) {
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

export function EmojiElement(props) {
  const ref = useRef(null)
  const instance = useRef(null)

  if (instance.current) {
    instance.current.update(props)
  }

  useEffect(() => {
    instance.current = new Emoji({ ...props, ref })

    return () => {
      instance.current = null
    }
  }, [])

  return React.createElement('span', { ref })
}
