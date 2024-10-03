import React from 'react'

import { Navbar } from '../../Components/Stateless'
import { ActivityForm } from '../../Components/Stateful'
import NavigationService from '../../Navigation'

const NewActivityScreen = ({ navigation }) => {
  return (
    <ActivityForm />
  )
}

NewActivityScreen.navigationOptions = ({ navigation, screenProps }) => {
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

export default NewActivityScreen
