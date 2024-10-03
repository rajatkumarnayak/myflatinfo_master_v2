import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
  human,
  iOSUIKit,
  systemWeights,
  iOSColors
} from 'react-native-typography'
import Icon from 'react-native-vector-icons/FontAwesome5'
import colors from '../../Themes/Colors'

export default ({ status, containerStyle }) => {
  const styles = {
    tag: { borderRadius: 10, flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 3, paddingHorizontal: 10 }
  }
  let text = null
  let color = null

  if (status === 0) {
    text = 'Pending'
    color = colors.orange300
  }

  if (status === 1) {
    text = 'Done'
    color = colors.green400
  }

  return (
    <View style={{ ...containerStyle }}>
      <Text style={{ ...human.caption2White, ...systemWeights.bold, color }}>
        {text}
      </Text>
    </View>
    // <View style={{ ...styles.tag, backgroundColor: color }}>
    //   <Text>
    //     <Text style={{ ...human.caption2White, ...systemWeights.semibold }}>
    //       {text}
    //     </Text>
    //   </Text>
    // </View>
  )
}
