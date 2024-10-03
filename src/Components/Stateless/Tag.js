import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { human, iOSColors } from 'react-native-typography'
import check from 'check-types'

import colors from '../../Themes/Colors'

const Tag = ({ text, color, textColor, success, error, warning }) => {
  if (check.not.assigned(color)) {
    if (success) {
      color = colors.green500
    } else if (warning) {
      color = colors.orange500
    } else if (error) {
      color = colors.red500
    }
  }

  return (
    <Text style={{
      ...styles.tag,
      backgroundColor: color,
      color: textColor || colors.white
    }}
    >
      {text}
    </Text>
  )
}

const styles = StyleSheet.create({
  tag: {
    ...human.caption2,
    fontSize: 9,
    backgroundColor: iOSColors.customGray,
    borderRadius: 10,
    marginTop: 5,
    paddingVertical: 2,
    paddingHorizontal: 12,
    textAlign: 'center'
  }
})

export default Tag
