import React from 'react'

import { Navbar } from '../../Components/Stateless'
import { ActivityForm } from '../../Components/Stateful'
import NavigationService from '../../Navigation'

const EditActivityScreen = ({ navigation }) => {
  const { item } = navigation.state.params

  return (
    <ActivityForm
      data={item}
      isEdit
      submitButtonText='Save Activity'
    />
  )
}

EditActivityScreen.navigationOptions = ({ navigation, screenProps }) => {
  const { navbarTitle } = navigation.state.params

  return {
    header: (
      <Navbar
        title={navbarTitle}
        onPressBack={() => NavigationService.navigate('Activities')}
      />
    )
  }
}

export default EditActivityScreen
