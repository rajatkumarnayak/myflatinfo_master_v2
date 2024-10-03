import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { Block } from 'galio-framework'
import { human, iOSColors } from 'react-native-typography'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'

import { AttendanceIcon, Navbar, FloatingActionButton, Button, NoData, Loader, Container, Divider } from '../../Components/Stateless'
import { FlatSelectorButton } from '../../Components/Stateful'
import useTheme from '../../Themes/Context'
import NavigationService from '../../Navigation'
import ActivitiesAgenda from './ActivitiesAgenda'
import viewStyles from '../../Styles/ViewStyles'
import { STATUS } from '../../Constants'
import { enumerateEventsByDate, groupEventsByDate } from '../../Utils/Utils'

const ActivitiesScreen = ({ navigation }) => {
  const { theme } = useTheme()
  const loadList = useStoreActions(actions => actions.activities.load)
  const { data, status, failureReason, license } = useStoreState(state => ({ ...state.activities }))
  const [_data, setData] = useState([])

  const onLoad = () => {
    return loadList({ date: null, endDate: null })
  }

  const renderContent = () => {
    if (check.emptyArray(data)) {
      return (
        <Block flex middle>
          <NoData text='No activities found' />
          <Divider />
          <Button
            onPress={onLoad}
            small
            shadowless
            round
            outline
            color='info'
          >
            Reload
          </Button>
        </Block>
      )
    }

    return (
      <ActivitiesAgenda
        data={_data}
        onPressItem={(item) => NavigationService.navigate('Activity', { item })}
        renderAttendanceIcon={(item) => <AttendanceIcon data={item} />}
        onLoad={onLoad}
      />
    )
  }

  useEffect(() => {
    onLoad()
  }, [])

  useEffect(() => {
    if (check.nonEmptyArray(data)) {
      const result = data
        .reduce(enumerateEventsByDate, [])
        .reduce(groupEventsByDate, [])
        .map(({ date, data }) => ({ title: date, data }))

      setData(result)
    }
  }, [data])

  return (
    <Container
      status={status}
      failureReason={failureReason}
      license={license}
      data={data}
    >
      {renderContent()}
      <FloatingActionButton
        color={theme.colors.primary}
        onPress={() => NavigationService.navigate('NewActivity')}
      />
    </Container>
  )
}

ActivitiesScreen.navigationOptions = ({ navigation, screenProps }) => {
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

export default ActivitiesScreen
