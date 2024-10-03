import React from 'react'
import { View } from 'react-native'
import colors from '../../Themes/Colors'

export default ({ small, large, vertical, line, style }) => {
  const gap = () => {
    if (small) {
      return 10
    }

    if (large) {
      return 40
    }

    return 20
  }

  if (line) {
    return (
      <View
        style={{
          backgroundColor: colors.grey300,
          height: 1,
          marginVertical: gap() / 2,
          ...style
        }}
      />
    )
  }

  if (line && vertical) {
    return (
      <View
        style={{
          backgroundColor: colors.grey300,
          width: 1,
          marginHorizontal: gap() / 2,
          ...style
        }}
      />
    )
  }

  if (vertical) {
    return (
      <View width={gap()} style={{ ...style }} />
    )
  }

  return (
    <View height={gap()} style={{ ...style }} />
  )
}
