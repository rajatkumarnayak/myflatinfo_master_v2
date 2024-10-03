import React from 'react'
import { Dimensions, TouchableOpacity, Text, Image, StyleSheet, FlatList, LogBox } from 'react-native'
import { Block } from 'galio-framework'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'

import { Icon } from '../../Icons'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import theme from '../../Themes/configs/default'
import colors from '../../Themes/Colors'

const { width } = Dimensions.get('screen')

const thumbMeasure = (width - 48 - 32) / 3

export default () => {
  // const [persistedFlatData, persistFlatData] = useStorage('@flat', DEFAULT_STORE_FLAT_DATA)
  const selectFlat = useStoreActions(actions => actions.app.selectFlat)
  const items = useStoreState(state => state.app.flatList)
  console.log(items,"items >>>>>>>>>>>>>>");
  const flat = useStoreState(state => state.app.flat)

  const _selectFlat = (item) => {
    selectFlat(item)
    // persistFlatData(item)
  }

  if (check.emptyArray(items)) {
    return (
      <Text style={{ ...human.caption2 }}>
        No flats to display
      </Text>
    )
  }

  const Item = ({ item, onPress }) => {
    const { flatId, flatNumber, block, image } = item
    console.log(image,'imageimage1')

    return (
      <TouchableOpacity onPress={() => _selectFlat(item)}>
        <Block style={styles.tile}>
          <Image
            resizeMode='cover'
            //source={{ uri: image }}
            source={require('../../../assets/images/flat-default.png')}
            style={styles.thumb}
          />
          <Block style={{ ...styles.check, ...elevationShadowStyle({ elevation: 6 }) }}>
            {
              check.assigned(flat) &&
              flat.flatId === flatId &&
                <Icon name='check-circle' size={30} color={theme.colors.primary} />
            }
          </Block>
          <Block>
            <Text style={{ ...human.body, ...systemWeights.semibold, marginTop: 5 }}>
              {flatNumber}
            </Text>
            <Text style={{ ...human.footnote, ...systemWeights.regular, color: iOSColors.gray }}>
              {block}
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>
    )
  }

  return (
    <Block>
      <FlatList
        data={items}
        keyExtractor={({ item, index }) => index}
        renderItem={({ item, index }) => <Item item={item} key={index} />}
        horizontal
      />
    </Block>
  )
}

const styles = StyleSheet.create({
  tile: {
    marginRight: 15,
    marginTop: 8,
    position: 'relative'
  },
  thumb: {
    alignSelf: 'center',
    borderRadius: 10,
    borderColor: colors.grey300,
    borderWidth: 2,
    height: thumbMeasure,
    width: thumbMeasure
  },
  check: {
    backgroundColor: 'white',
    borderRadius: 50,
    position: 'absolute',
    right: -5,
    top: -8,
    zIndex: 1
  }
})
