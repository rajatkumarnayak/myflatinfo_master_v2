import React from 'react'

import { Navbar } from '../../Components/Stateless'
import { GatepassForm } from '../../Components/Stateful'
import NavigationService from '../../Navigation'

const NewGatepassScreen = ({ navigation }) => {
  return (
    <GatepassForm
      onSuccess={() => NavigationService.goBack()}
    />
  )
}

NewGatepassScreen.navigationOptions = ({ navigation, screenProps }) => {
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

export default NewGatepassScreen
