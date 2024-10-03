import React from 'react'
import { View, Text } from 'react-native'
import { Block } from 'galio-framework'

import SettingItemBlockVisitors from './SettingItemBlockVisitors'
import SettingsClassifieds from './SettingsClassifieds'
import viewStyles from '../../Styles/ViewStyles'

const SettingGroupFlat = () => {
  return (
    <>
      <View>
        <View>
          <Text style={viewStyles.settingGroupTitle}>FLAT</Text>
          <Block style={viewStyles.settingGroup}>
            <SettingItemBlockVisitors />
          </Block>
        </View>

        <View>
          <Text style={viewStyles.settingGroupTitle}>CLASSIFIEDS</Text>
          <Block style={viewStyles.settingGroup}>
            <SettingsClassifieds />
          </Block>
        </View>
      </View>

    </>
  )
}

export default SettingGroupFlat
