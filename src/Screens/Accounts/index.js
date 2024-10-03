import React, { useEffect , useState} from 'react'
import { Block } from 'galio-framework'
import { Tab, Tabs, ScrollableTab } from 'native-base'
import { useStoreState } from 'easy-peasy'
import check from 'check-types'

import { Navbar } from '../../Components/Stateless'
import { FlatSelectorButton } from '../../Components/Stateful'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Maintenances from './Maintenances'
import Donations from './Donations'
import Others from './Others'
import Corpuses from './Corpuses'
import Cashflow from './Cashflow'
import viewStyles from '../../Styles/NavigationStyles'

const AccountsScreen = ({ navigation }) => {
  const flat = useStoreState(state => state.app.flat)
  const [tenent , setTenent]=useState()

  useEffect(() => {
    navigation.setParams({
      flat: check.assigned(flat) ? flat : ''
    })
    getTenent()
  }, [flat])


  const getTenent=async()=>{
    console.log('calling >>> at get temnent');
    console.log('setup kldldl');
    const loginAuthUserData = await AsyncStorage.getItem('loginAuthUser');
    console.log(loginAuthUserData ,"loginAuthUserData >>");
    setTenent(loginAuthUserData)
  }

  return (
    <Block flex>
      {/* <TabBar>
        <TabBarItem text='Maintenance'>
          <Maintenances />
        </TabBarItem>
        <TabBarItem text='Donation'>
          <Donations />
        </TabBarItem>
        <TabBarItem text='Donation'>
          <Corpuses />
        </TabBarItem>
        <TabBarItem text='Donation'>
          <Cashflow />
        </TabBarItem>
      </TabBar> */}
    {tenent == "true" ? 
     (
       <Block flex>
           <Tabs tabBarUnderlineStyle={viewStyles.tabBarUnderlineStyle}>
        <Tab heading="Maintenance" tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
        <Maintenances />
        </Tab>
        <Tab heading="Events" tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
        <Donations />
        </Tab>
        <Tab heading="Cash Flow" tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
        <Cashflow />
        </Tab>
      </Tabs>

       
       </Block>
     ):
     (
      <Block  flex>
      <Tabs renderTabBar={() => <ScrollableTab />} tabBarUnderlineStyle={viewStyles.tabBarUnderlineStyle}>
   <Tab heading='Maintenance' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
     <Maintenances />
   </Tab>
   
   <Tab heading='Events' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
     <Donations />
   </Tab>

    <Tab heading='Essentials' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
      <Others />
     </Tab>

    <Tab heading='Corpus' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
     <Corpuses />
    </Tab>
 
 
   <Tab heading='Cash Flow' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
     <Cashflow />
   </Tab>
  
 </Tabs>
  </Block>
     )}
    </Block>
  )

  // return (
  //   <Block flex>
  //     {/* <TabBar>
  //       <TabBarItem text='Maintenance'>
  //         <Maintenances />
  //       </TabBarItem>
  //       <TabBarItem text='Donation'>
  //         <Donations />
  //       </TabBarItem>
  //       <TabBarItem text='Donation'>
  //         <Corpuses />
  //       </TabBarItem>
  //       <TabBarItem text='Donation'>
  //         <Cashflow />
  //       </TabBarItem>
  //     </TabBar> */}
  //     <Tabs renderTabBar={() => <ScrollableTab />} tabBarUnderlineStyle={viewStyles.tabBarUnderlineStyle}>
  //       <Tab heading='Maintenance' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
  //         <Maintenances />
  //       </Tab>
  //       <Tab heading='Events' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
  //         <Donations />
  //       </Tab>
  //       <Tab heading='Essentials' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
  //         <Others />
  //       </Tab>
  //       <Tab heading='Corpus' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
  //         <Corpuses />
  //       </Tab>
  //       <Tab heading='Cash Flow' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
  //         <Cashflow />
  //       </Tab>
       
  //     </Tabs>
  //   </Block>
  // )
}

AccountsScreen.navigationOptions = ({ navigation, screenProps }) => {
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

export default AccountsScreen

