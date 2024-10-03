import React from 'react'
import { Block } from 'galio-framework'
import { Tab, Tabs, ScrollableTab } from 'native-base'

import { Navbar } from '../../Components/Stateless'
import { FlatSelectorButton } from '../../Components/Stateful'
import Info from './Info'
import Visitors from './Visitors'
import Parkings from './Parkings'
import FamilyMembers from './FamilyMembers'
import viewStyles from '../../Styles/NavigationStyles'

const FlatScreen = ({ navigation }) => {
  return (
    <Block flex>
      <Tabs renderTabBar={() => <ScrollableTab />} tabBarUnderlineStyle={viewStyles.tabBarUnderlineStyle}>
        <Tab heading='Info' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
          <Info />
        </Tab>
        <Tab heading='Visitors' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
          <Visitors />
        </Tab>
        <Tab heading='Parking' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
          <Parkings />
        </Tab>
        <Tab heading='Family Members' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
          <FamilyMembers />
        </Tab>
      </Tabs>
    </Block>
  )
}

FlatScreen.navigationOptions = ({ navigation, screenProps }) => {
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

export default FlatScreen
