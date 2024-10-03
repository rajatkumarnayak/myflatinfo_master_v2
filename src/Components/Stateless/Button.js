import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Button as GalioButton } from 'galio-framework'
import LinearGradient from 'react-native-linear-gradient'

import argonTheme from '../../Themes/configs/argonTheme'
import { human, iOSColors } from 'react-native-typography'

const Button = (props) => {
  const { label, link = false, small, block, shadowless, outline, children, color, colors, style } = props

  const colorStyle = color && argonTheme.COLORS[color.toUpperCase()]

  const buttonStyles = [
    small && styles.smallButton,
    color && { backgroundColor: outline ? '#f5f5f5' : colorStyle },
    outline && { borderColor: colorStyle, borderWidth: 1 },
    !shadowless && styles.shadow,
    block && { width: '100%' },
    { ...style }
  ]

  const textStyles = [
    { fontSize: 12 },
    color && { color: colorStyle }
  ]

  if (colors && colors.length >= 2) {
    return (
      <GalioButton
        style={buttonStyles}
        color='transparent'
        textStyle={{
          width: '100%',
          fontSize: 12,
          fontWeight: '700'
        }}
        {...props}
      >
        <LinearGradient
          colors={colors}
          style={{
            flex: 1,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            ...style
          }}
        >
          {children}
        </LinearGradient>
      </GalioButton>
    )
  }

  if (link) {
    return (
      <GalioButton
        color='transparent'
        style={{
          alignItems: 'flex-start'
        }}
        {...props}
      >
        <Text style={{ ...human.footnoteWhite, color: iOSColors.blue }}>{label}</Text>
      </GalioButton>
    )
  }

  return (
    <GalioButton
      style={buttonStyles}
      textStyle={textStyles}
      {...props}
    >
      {children}
    </GalioButton>
  )
}

const styles = StyleSheet.create({
  smallButton: {
    width: 75,
    height: 36
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2
  }
})

export default Button
