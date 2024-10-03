import React, { useEffect } from 'react'
import { InteractionManager } from 'react-native'
import { Tab, Tabs } from 'native-base'
import { useStoreState, useStoreActions } from 'easy-peasy'

import { Navbar, FloatingActionButton, Container } from '../../Components/Stateless'
import { FlatSelectorButton } from '../../Components/Stateful'
import BookingsCalendarView from './BookingsCalendarView'
import BookingsListView from './BookingsListView'
import viewStyles from '../../Styles/NavigationStyles'
import useTheme from '../../Themes/Context'
import NavigationService from '../../Navigation'

const BookingsScreen = ({ navigation }) => {
  const { theme } = useTheme()
  const load = useStoreActions(actions => actions.bookings.load)
  const { data, status, license, failureReason } = useStoreState(state => ({ ...state.bookings }))
  console.log(data,'bookings')
  const onLoad = () => {
    return load({ startDate: null, endDate: null })
  }

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      onLoad()
    })
  }, [])

  return (
    <>
      <Container
        status={status}
        failureReason={failureReason}
        license={license}
        data={data}
        onLoad={() => onLoad()}
      >
        <Tabs tabBarUnderlineStyle={viewStyles.tabBarUnderlineStyle}>
          <Tab heading='Calendar View' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
            <BookingsCalendarView
              data={data}
              onLoad={onLoad}
            />
          </Tab>
          <Tab heading='List View' tabStyle={viewStyles.tabStyle} activeTabStyle={viewStyles.activeTabStyle} textStyle={viewStyles.tabTextStyle} activeTextStyle={viewStyles.activeTabTextStyle}>
            <BookingsListView
              data={data}
              networkStatus={status}
              onLoad={onLoad}
            />
          </Tab>
        </Tabs>

      </Container>
      <FloatingActionButton
        color={theme.colors.primary}
        onPress={() => NavigationService.navigate('NewBooking')}
      />
    </>
  )
}

BookingsScreen.navigationOptions = ({ navigation, screenProps }) => {
  const { navbarTitle } = navigation.state.params

  return {
    header: (
      <Navbar
        title={navbarTitle}
        rightComponent={<FlatSelectorButton />}
        onPressBack={() => NavigationService.goBack()}
      />
    )
  }
}

export default BookingsScreen
