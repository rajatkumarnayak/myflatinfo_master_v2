import React from 'react'
import { Text } from 'react-native'
import { Tabs, ScrollableTab, Tab, TabHeading } from 'native-base'
import { human } from 'react-native-typography'
import viewStyles from '../../Styles/ViewStyles'

export const TabBar = ({ children }) => {
  return (
    <Tabs renderTabBar={() => <ScrollableTab />} tabBarUnderlineStyle={viewStyles.tabBarUnderlineStyle}>
      {children}
    </Tabs>
  )
}

export const TabBarItem = ({ text, children }) => {
  return (
    <Tab
      heading={(
        <TabHeading>
          <Text style={{ ...human.caption2 }}>{text}</Text>
        </TabHeading>
      )}
      tabStyle={viewStyles.tabStyle}
      activeTabStyle={viewStyles.activeTabStyle}
      textStyle={viewStyles.tabTextStyle}
      activeTextStyle={viewStyles.activeTabTextStyle}
    >
      {children}
    </Tab>
  )
}
