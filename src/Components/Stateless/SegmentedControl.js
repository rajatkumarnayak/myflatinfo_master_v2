import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import check from 'check-types'

const DEFAULT_BUTTON_COLOR = '#fff'
const DEFAULT_BUTTON_TEXT_COLOR = '#000'

export default ({ items, selectedIndex, updateIndex, buttonColors, buttonTextColor, style }) => {
  let _buttonColors

  if (check.assigned(buttonColors)) {
    if (buttonColors.length === 1) {
      _buttonColors = buttonColors[0]
    } else {
      _buttonColors = buttonColors
    }
  }

  const buttons = items.map((item, index) => {
    const element = (
      <View style={{ backgroundColor: check.not.assigned(_buttonColors) ? DEFAULT_BUTTON_COLOR : _buttonColors[index] }}>
        <Text style={{ ...human.body, color: buttonTextColor || DEFAULT_BUTTON_TEXT_COLOR }} key={index}>
          {item}
        </Text>
      </View>
    )

    return { element }
  })

  return (
    <ButtonGroup
      buttons={buttons}
      onPress={updateIndex}
      selectedIndex={selectedIndex}
    />
  )
}
