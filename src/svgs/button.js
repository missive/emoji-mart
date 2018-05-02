import React from 'react'
import Svg, { Path, G, Circle, Rect } from 'react-native-svg'

export default (
  <Svg width="18" height="18" viewBox="0 0 22 22">
    <G origin="-1373.5, -50.5">
      <G origin="1371, 48">
        <Circle cx="12" cy="12" r="9.5" fill="#999" />
        <Circle cx="12" cy="12" r="7.5" fill="#fff" />
        <Path
          d="m11.938 17.125c2.509 0 5.439-1.929 5.439-3.924 0-0.068-0.885-0.417-1.171 0-0.264 0.383-1.262 1.506-4.238 1.506s-3.775-1.033-4.132-1.506c-0.259-0.342-1.336-0.051-1.336 0.013 0 1.968 2.93 3.911 5.438 3.911z"
          fill="#999"
        />
        <Rect x="8.5" y="7.5" width="2" height="4" fill="#d8d8d8" />
        <Rect x="9" y="8" width="1" height="3" fill="none" stroke="#979797" />
        <Rect x="13.5" y="7.5" width="2" height="4" fill="#d8d8d8" />
        <Rect x="14" y="8" width="1" height="3" fill="none" stroke="#979797" />
      </G>
    </G>
  </Svg>
)
