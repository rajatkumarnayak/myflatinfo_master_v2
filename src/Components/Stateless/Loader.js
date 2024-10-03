import React from 'react'
import { ActivityIndicator } from 'react-native'
import { Block } from 'galio-framework'

export default ({ text }) => {
  return (
    <Block flex={1} middle>
      <ActivityIndicator size='large' />
    </Block>
  )
}
