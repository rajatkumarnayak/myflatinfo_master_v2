import React from 'react'
import { StyleSheet, Image, Text } from 'react-native'
import { Block } from 'galio-framework'
import { human, iOSColors } from 'react-native-typography'

export default ({ text }) => {
  return (
    <Block middle>
      <Image
        source={require('../../../assets/images/nodata.png')}
        style={styles.image}
        resizeMode='contain'
      />
      <Text
        style={{ ...human.caption1, color: iOSColors.gray, marginTop: 5 }}
      >
        {text || 'No records found'}
      </Text>
    </Block>
  )
}

const styles = StyleSheet.create({
  image: {
    height: 120,
    width: 120
  }
})
