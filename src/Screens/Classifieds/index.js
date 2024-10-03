import React, { useEffect, useCallback } from 'react'
import { Tab, Tabs } from 'native-base'
import { useStoreActions, useStoreState } from 'easy-peasy'
import check from 'check-types'

import { Container, Navbar } from '../../Components/Stateless'
import BuilderProjectsScreen from './BuilderProjects'
import LikedProjectsScreen from './LikedProjects'
import AllProjectsScreen from './AllProjects'
import viewStyles from '../../Styles/NavigationStyles'
import NavigationService from '../../Navigation'

const ClassifiedsScreen = ({ navigation }) => {
  const flat = useStoreState(state => state.app.flat)
  console.log(flat,"flat");
  const load = useStoreActions(actions => actions.issues.load)
  console.log(load, 'load >>>>')
  const { data, status, failureReason, license } = useStoreState(state => ({ ...state.issues }))

  console.log(data, status, 'data >>>>>')

  const onLoad = useCallback(() => {
    return load({ startDate: null, endDate: null })
  })

  useEffect(() => {
    if (check.assigned(flat)) {
      onLoad()
    }
  }, [flat])

  return (
    <Container
      status={status}
      failureReason={failureReason}
      license={license}
      data={data}
      onLoad={() => onLoad()}
    >
      <Tabs tabBarUnderlineStyle={viewStyles.tabBarUnderlineStyle}>
        <Tab
          heading='My Builder'
          tabStyle={viewStyles.tabStyle}
          activeTabStyle={viewStyles.activeTabStyle}
          textStyle={viewStyles.tabTextStyle}
          activeTextStyle={viewStyles.activeTabTextStyle}
        >
          <BuilderProjectsScreen />
        </Tab>
        <Tab
          heading='All Builders'
          tabStyle={viewStyles.tabStyle}
          activeTabStyle={viewStyles.activeTabStyle}
          textStyle={viewStyles.tabTextStyle}
          activeTextStyle={viewStyles.activeTabTextStyle}
        >
          <AllProjectsScreen />
        </Tab>
        <Tab
          heading='Liked'
          tabStyle={viewStyles.tabStyle}
          activeTabStyle={viewStyles.activeTabStyle}
          textStyle={viewStyles.tabTextStyle}
          activeTextStyle={viewStyles.activeTabTextStyle}
        >
          <LikedProjectsScreen />
        </Tab>
      </Tabs>
    </Container>
  )
}

ClassifiedsScreen.navigationOptions = ({ navigation, screenProps }) => {
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

export default ClassifiedsScreen
