import React from 'react'
import { Text, StyleSheet, ScrollView } from 'react-native'
import { Block, theme } from 'galio-framework'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import { useStoreState } from 'easy-peasy'
import check from 'check-types'

import viewStyles from '../../Styles/ViewStyles'
import colors from '../../Themes/Colors'
import elevationShadowStyle from '../../Utils/ShadowStyle'

const Item = ({ label, value }) => {
  return (
    <Block flex row middle space='between' style={styles.item}>
      <Text
        style={{ ...human.subhead, color: iOSColors.gray }}
      >
        {label}
      </Text>
      <Text
        style={{ ...human.body, ...systemWeights.bold }}
      >
        {value}
      </Text>
    </Block>
  )
}

const FlatInfoScreen = ({ navigation }) => {
  const flat = useStoreState(state => state.app.flat)

  return (
    <Block flex style={viewStyles.mainContainer}>
      <ScrollView>
        {
          check.not.assigned(flat)
            ? <></>
            : (
              <Block card style={styles.card}>
                <Item label='Number' value={flat.flatNumber} />
                <Item label='Block' value={flat.block} />
                <Item label='Area' value={flat.flatArea} />
                <Item label='Owner' value={flat.ownerName} />
                <Item label='Resident' value={flat.tenantName} />
              </Block>
            )
        }
      </ScrollView>
    </Block>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    margin: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE * 2,
    ...elevationShadowStyle({ elevation: 6 })
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: iOSColors.customGray,
    height: 60,
    paddingHorizontal: theme.SIZES.BASE
  }
})

export default FlatInfoScreen
