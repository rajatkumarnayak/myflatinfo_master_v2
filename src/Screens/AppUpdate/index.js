import React, { useContext } from 'react'
import { Text } from 'react-native'
import { Button } from 'react-native-elements'
import AppStateContext from '../../Services/Auth/AppContext'
import { Container, LoadingActionContainer } from '../../Components/Stateless'
import colors from '../../Themes/Colors'

const AppUpdate = () => {
  const { state, logout } = useContext(AppStateContext)

  return (
    <LoadingActionContainer fixed>
      <Container
        style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{ fontSize: 24, color: colors.cyan700 }}>
          APP UPDATE SCREEN
        </Text>

        <Button style={{ marginTop: 20 }}>SAY HELLO !</Button>
      </Container>
    </LoadingActionContainer>
  )
}

export default AppUpdate
