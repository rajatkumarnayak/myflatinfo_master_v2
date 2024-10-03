import React, { useEffect, useCallback } from 'react'
import { Block } from 'galio-framework'
import { Tab, Tabs } from 'native-base'
import { useStoreActions, useStoreState } from 'easy-peasy'
import check from 'check-types'

import { Container, Navbar, FloatingActionButton } from '../../Components/Stateless'
import { FlatSelectorButton } from '../../Components/Stateful'
import OngoingIssuesScreen from './OngoingIssues'
import PastIssuesScreen from './PastIssues'
import NavigationService from '../../Navigation'
import viewStyles from '../../Styles/NavigationStyles'
import colors from '../../Themes/Colors'

const IssuesScreen = ({ navigation }) => {
  const flat = useStoreState(state => state.app.flat)
  const load = useStoreActions(actions => actions.issues.load)
  const { data, status, failureReason, license } = useStoreState(state => ({ ...state.issues }))

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
        <Tab heading='Ongoing' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
          <OngoingIssuesScreen data={data} />
        </Tab>
        <Tab heading='Past' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
          <PastIssuesScreen data={data} />
        </Tab>
      </Tabs>
      <FloatingActionButton
        color={colors.red500}
        onPress={() => NavigationService.navigate('NewIssue')}
      />
    </Container>
  )
}

IssuesScreen.navigationOptions = ({ navigation, screenProps }) => {
  const { navbarTitle } = navigation.state.params

  return {
    header: (
      <Navbar
        title={navbarTitle}
        rightComponent={<FlatSelectorButton />}
      />
    )
  }
}

export default IssuesScreen
