import React from 'react'
import { StyleSheet, Image, Text } from 'react-native'
import { Block } from 'galio-framework'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import Divider from './Divider'

export default ({ label, value }) => {
  return (
    <Block flex row middle space='between' style={styles.item}>
      <Block style={styles.itemContent}>
        <Text style={styles.itemLabel}>
          {label}
        </Text>
        <Divider small />
        <Text style={styles.itemValue}>
          {value}
        </Text>
      </Block>
    </Block>
  )
}

const styles = StyleSheet.create({
  item: {
    height: 80
  },
  itemContent: {
    width: '100%'
  },
  itemLabel: { ...human.caption1, color: iOSColors.gray },
  itemValue: { ...human.subhead, ...systemWeights.bold }
})
