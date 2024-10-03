import React from 'react'
import { Picker as NBPicker } from 'native-base'
import { View, StyleSheet, Text } from 'react-native'
import { Icon } from '.'

const Picker = ({ mode = 'dropdown', placeholder, onValueChange, selectedValue, ...props }) => {
  return (
    <View>
      <NBPicker
        mode={mode}
        {...props}
        iosIcon={<Icon name='chevron-down' />}
        onValueChange={onValueChange}
        selectedValue={selectedValue}

      />
      <Text numberOfLines={1} style={styles.pickerText}>
        {placeholder}
      </Text>
    </View>

  )
}
const styles = StyleSheet.create({
  pickerText: {
    fontSize: 15,
    position: 'absolute',
    top: 15,
    right: 8,
    width: '90%'
  }
})
export default Picker
