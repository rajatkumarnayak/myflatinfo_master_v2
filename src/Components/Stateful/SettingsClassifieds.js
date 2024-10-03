import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity , Switch as Switcher } from 'react-native'
import viewStyles from '../../Styles/ViewStyles'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import { Block } from 'galio-framework'

import { ApiService, StoreService } from '../../Store'
import colors from '../../Themes/Colors'
import GalioTheme, { withGalio } from '../../Themes'

const SettingClassifieds = () => {
  const [active, setActive] = useState(false)
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    // blocktNotificationsById()
    // allowNotificationsById()
    // getNotificationsById()
  }, [active])

  // const payload = {
  //   userid: 245
  // }
  const allowPayload = {
    ownerid: StoreService.getState().login.id,
    key: 1
  }
  const blockPayload = {
    ownerid: StoreService.getState().login.id,
    key: 1
  }

  // async function getNotificationsById () {
  //   console.log('calling >>> here')
  //   const response = await ApiService.getNotifications(payload)
  //   console.log(response, 'data >>> form notification ')
  // }
  async function allowNotificationsById () {
    console.log('calling >>> here')
    const response = await ApiService.allowNotifications(allowPayload)
    console.log(response, 'data >>> form allow -notification ')
  }
  async function blocktNotificationsById () {
    console.log('calling >>> here')
    const response = await ApiService.blockedNotifications(blockPayload)
    console.log(response, 'data >>> form block - notification ')
  }

  const onSubmit = () => {
    setActive(!active)
    console.log('calling >>')
    if (active) {
      console.log('sucess')
      blocktNotificationsById()
    } else {
      console.log('failed')
      allowNotificationsById()
    }
  }

  return (
    <View>
      <TouchableOpacity onPress={() => onSubmit()} style={viewStyles.settingItem}>
         
        <Block>
          <Text
            style={{ ...human.body, ...systemWeights.semibold }}
          >Builder Classifieds Notifications
          </Text>
          {
            active ? (<Text style={{ ...human.caption1, color: iOSColors.gray }}>Active</Text>) : (<Text style={{ ...human.caption1, color: iOSColors.gray }}>Blocked</Text>)
          }
        </Block>
        {/* <Switch value={active} trackColor onChange={() => setActive(!active)} /> */}
        <Switcher
          disabled={disabled}
          trackColor={{ false: '#a8a7a7', true: '#b1e6dd' }}
          ios_backgroundColor='#3e3e3e'
          value={active}
          thumbColor={active ? '#33a390' : '#f2f2f2'}
          onValueChange={() => {
            console.log('calling >>>')
            onSubmit()
          }}
        />
      </TouchableOpacity>

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    ...viewStyles.mainContainer,
    paddingBottom: 0
  },
  section: {
    // marginHorizontal: galioTheme.SIZES.BASE
  }
})
export default SettingClassifieds
