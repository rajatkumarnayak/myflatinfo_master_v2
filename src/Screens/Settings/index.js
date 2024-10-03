import React from 'react'

import { Container, Navbar } from '../../Components/Stateless'
import { SettingGroupFlat } from '../../Components/Stateful'
import NavigationService from '../../Navigation'

const SettingScreen = ({ navigation }) => {
  return (
    <Container>
      {/* <SettingList
        items={datas}
        onLoad={onLoad}
        onPressItem={() => modalRef.current.show()}
        noDataComponent={() => <NoData text='No surveys found' />}
        switchValues={switchValue}
      /> */}
      <SettingGroupFlat />
    </Container>
  )
}

SettingScreen.navigationOptions = ({ navigation, screenProps }) => {
  const { navbarTitle } = navigation.state.params

  return {
    header: (
      <Navbar
        title={navbarTitle}
        onPressBack={() => NavigationService.goBack()}
      />
    )
  }
}

export default SettingScreen
