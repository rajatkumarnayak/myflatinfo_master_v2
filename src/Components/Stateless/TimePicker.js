import React, { useState } from 'react'
import { StyleSheet, View, FlatList, Text } from 'react-native'
import _ from 'lodash'
import moment from 'moment'

import { TouchableRipple } from '.'
import COLORS from '../../Themes/Colors'
import elevationShadowStyle from '../../Utils/ShadowStyle'
// import Spacings from '../../DesignSystem/Spacings'
// import useTheme from '../../Themes/Context'
// import { enumerateTimeDuration } from '../../Utils/Utils'

const TimePicker = (props) => {
  const {
    startTimeInMinutes = 480,
    endTimeInMinutes = 1200,
    durationInMinutes = 60,
    selectedValue,
    onSelect
  } = props

  // const { colors } = useTheme()

  // const [data, setData] = useState(_.range(startTimeInMinutes, endTimeInMinutes, durationInMinutes)
  //   .map(item => moment({ hour: Math.floor(item / 60), minute: item % 60 }).format('HH:mm'))
  // )
  
  const [data, setData] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  const Item = ({ item, index }) => {
    return (
      <TouchableRipple
        onPress={() => onSelect(item)}
        style={[
          styles.item,
          { borderColor: COLORS.grey700 },
          index === 0 && styles.firstItem,
          item === selectedValue && { backgroundColor: COLORS.blueJeans }
        ]}
      >
        <Text
          caption1
          semibold
          style={{ color: item === selectedValue ? COLORS.white : COLORS.grey700 }}
        >
          {item}
          {/* {moment(item, 'HH:mm').format('h a')} */}
        </Text>
      </TouchableRipple>
    )
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => <Item item={item} index={index} />}
        nestedScrollEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  root: {
    margin: -3
  },
  item: {
    alignItems: 'center',
    borderRadius: 6,
    height: 50,
    justifyContent: 'center',
    marginHorizontal: 8,
    marginVertical: 3,
    width: 50,
    backgroundColor: COLORS.white,
    ...elevationShadowStyle({ elevation: 3 })
  },
  firstItem: {
    marginLeft: 3
  }
})

export default TimePicker
