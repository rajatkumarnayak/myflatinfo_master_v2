import React, { useEffect } from 'react'
import { Block } from 'galio-framework'
import { useStoreState, useStoreActions } from 'easy-peasy'

import { Container, Navbar, Listing, NoData } from '../../Components/Stateless'
import NavigationService from '../../Navigation'
import viewStyles from '../../Styles/ViewStyles'

const SurveysScreen = ({ navigation }) => {
  const load = useStoreActions(actions => actions.surveys.load)
  const { data, status, failureReason, license } = useStoreState(state => ({ ...state.surveys }))

  const onLoad = () => {
    return load({ startDate: null, endDate: null })
  }

  useEffect(() => {
    onLoad()
  }, [])

  return (
    <Container
      status={status}
      failureReason={failureReason}
      license={license}
      data={data}
    >
      <Listing
        items={data}
        onLoad={onLoad}
        onPressItem={(item) => {
          NavigationService.navigate('Survey', { item })
        }}
        noDataComponent={() => <NoData text='No surveys found' />}
      />
    </Container>
  )
}

SurveysScreen.navigationOptions = ({ navigation, screenProps }) => {
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

export default SurveysScreen
