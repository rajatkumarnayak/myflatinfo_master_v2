import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, ScrollView, FlatList } from 'react-native'
import { Block, theme as galioTheme, Button } from 'galio-framework'
import { iOSColors, human, systemWeights } from 'react-native-typography'
import { useStoreActions, useStoreState } from 'easy-peasy'
import check from 'check-types'
import moment from 'moment'

import { AttendanceIcon, Navbar, Divider, DetailsLineItem } from '../../Components/Stateless'
import { Icon } from '../../Icons'
import viewStyles from '../../Styles/ViewStyles'
import useTheme from '../../Themes/Context'
import { STATUS, ACTIVITY_ATTENDANCE, ACTIVITY_DISPLAY_DATE_FORMAT, API_RESPONSE_DATE_FORMAT } from '../../Constants'
import NavigationService from '../../Navigation'
import { ApiService } from '../../Store'

const Tag = ({ text, detail }) => {
  return (
    <Block row style={{ backgroundColor: iOSColors.lightGray, borderRadius: 3, marginBottom: 10 }}>
      <Text style={{ ...human.footnote, paddingHorizontal: 10, paddingVertical: 5 }}>
        {text}
      </Text>
      {
        detail && (
          <Text style={{ ...human.footnote, ...systemWeights.bold, paddingHorizontal: 10, paddingVertical: 5 }}>
            {detail}
          </Text>
        )
      }
    </Block>
  )
}

const ActivityScreen = ({ navigation }) => {
  const { item } = navigation.state.params
  const { theme } = useTheme()
  const loadList = useStoreActions(actions => actions.activities.load)
  const userId = useStoreState(state => state.login.id)
  const [data, setData] = useState(item)
  const [ownerId, setOwnerId] = useState(null)
  const [title, setTitle] = useState(null)
  const [description, setDescription] = useState(null)
  const [items, setItems] = useState([])
  const [attendances, setAttendances] = useState([])
  const [isAttending, setIsAttending] = useState(1)
  const [networkStatus, setNetworkStatus] = useState(STATUS.NOT_STARTED)

  const _setData = (data) => {
    const { name, ownerId, description, venue, ownerName, isAttending, attendances } = data

    setData(data)
    setOwnerId(ownerId)
    setTitle(name)
    setDescription(description)
    setIsAttending(isAttending)
    setAttendances(attendances)
    setItems([
      {
        label: 'Venue',
        value: venue,
        display: true
      },
      {
        label: 'Activity created by',
        value: ownerName,
        display: true
      }
    ])
  }

  async function load () {
    setNetworkStatus(STATUS.FETCHING)
    const response = await ApiService.fetchActivityItemData(item)
    if (response.ok) {
      setNetworkStatus(STATUS.SUCCESS)
      _setData(response.data)
    } else {
      setNetworkStatus(STATUS.FAILED)
    }
  }
  async function update (payload) {
    setNetworkStatus(STATUS.FETCHING)
    const response = await ApiService.updateActivityItemData(payload)
    if (response.ok) {
      setNetworkStatus(STATUS.SUCCESS)
      // _setData(response.data)
      NavigationService.goBack()
      loadList({ startDate: null, endDate: null })
    } else {
      setNetworkStatus(STATUS.FAILED)
    }
  }

  const onUpdate = ({ isAttending }) => {
    update({
      ...data,
      isAttending
    })
  }

  const renderOccurrenceDetails = () => {
    if (check.not.assigned(data)) {
      return <></>
    }

    const startDate = moment(data.startDate)
    const endDate = moment(data.endDate)

    const areBothDatesSame = () => {
      return moment(startDate).isSame(moment(endDate), 'day')
    }

    const calendarIcon = areBothDatesSame()
      ? 'calendar'
      : 'calendar-range'

    const day = areBothDatesSame()
      ? startDate.format(ACTIVITY_DISPLAY_DATE_FORMAT)
      : `${startDate.format(ACTIVITY_DISPLAY_DATE_FORMAT)} - ${endDate.format(ACTIVITY_DISPLAY_DATE_FORMAT)}`

    const timeIcon = 'progress-clock'
    const { startTime, endTime } = data
    const time = `${startTime} - ${endTime}`

    return (
      <Block>
        <Block row>
          <Icon name={calendarIcon} color={iOSColors.midGray} />
          <Block width={galioTheme.SIZES.BASE} />
          <Block middle>
            <Text style={{ ...human.body, ...systemWeights.bold }}>{day}</Text>
          </Block>
        </Block>
        <Divider small />
        <Block row>
          <Icon name={timeIcon} color={iOSColors.midGray} />
          <Block width={galioTheme.SIZES.BASE} />
          <Block middle>
            <Text style={{ ...human.body, ...systemWeights.bold }}>{time}</Text>
          </Block>
        </Block>
      </Block>
    )
  }

  const renderAttendanceDetails = () => {
    // if (check.not.equal(userId, ownerId)) {
    //   return <></>
    // }

    return (
      <Block>
        <Divider />
        <Text style={{ ...human.caption1, color: iOSColors.gray }}>Participants</Text>
        <Divider small />
        <Block row style={{ flexWrap: 'wrap' }}>
          {
            attendances.map(({ label, count }, index) => {
              return (
                <>
                  <Tag key={index} text={label} detail={count.toString()} />
                  <Divider small vertical />
                </>
              )
            })
          }
        </Block>
      </Block>
    )
  }

  const renderActionButtonYes = () => (
    <Block center>
      <Button
        round
        color={isAttending === ACTIVITY_ATTENDANCE.YES.value ? iOSColors.midGray : ACTIVITY_ATTENDANCE.YES.color}
        onPress={() => onUpdate({ isAttending: ACTIVITY_ATTENDANCE.YES.value })}
        disabled={isAttending === ACTIVITY_ATTENDANCE.YES.value}
        style={styles.changeStatusButton}
      >
        <Icon name={ACTIVITY_ATTENDANCE.YES.icon} origin={ACTIVITY_ATTENDANCE.YES.iconType} color={iOSColors.white} />
      </Button>
      <Divider small />
      <Text style={{ ...human.caption2 }}>{ACTIVITY_ATTENDANCE.YES.label}</Text>
    </Block>
  )

  const renderActionButtonMaybe = () => (
    <Block center>
      <Button
        round
        color={isAttending === ACTIVITY_ATTENDANCE.MAYBE.value ? iOSColors.midGray : ACTIVITY_ATTENDANCE.MAYBE.color}
        onPress={() => onUpdate({ isAttending: ACTIVITY_ATTENDANCE.MAYBE.value })}
        disabled={isAttending === ACTIVITY_ATTENDANCE.MAYBE.value}
        style={styles.changeStatusButton}
      >
        <Icon name={ACTIVITY_ATTENDANCE.MAYBE.icon} origin={ACTIVITY_ATTENDANCE.MAYBE.iconType} color={iOSColors.white} />
      </Button>
      <Divider small />
      <Text style={{ ...human.caption2 }}>{ACTIVITY_ATTENDANCE.MAYBE.label}</Text>
    </Block>
  )

  const renderActionButtonNo = () => (
    <Block center>
      <Button
        round
        color={isAttending === ACTIVITY_ATTENDANCE.NO.value ? iOSColors.midGray : ACTIVITY_ATTENDANCE.NO.color}
        onPress={() => onUpdate({ isAttending: ACTIVITY_ATTENDANCE.NO.value })}
        disabled={isAttending === ACTIVITY_ATTENDANCE.NO.value}
        style={styles.changeStatusButton}
      >
        <Icon name={ACTIVITY_ATTENDANCE.NO.icon} color={iOSColors.white} />
      </Button>
      <Divider small />
      <Text style={{ ...human.caption2 }}>{ACTIVITY_ATTENDANCE.NO.label}</Text>
    </Block>
  )

  const renderActionButtonEdit = () => (
    <Button
      round
      color={theme.colors.primary}
      onPress={() => {
        NavigationService.navigate('EditActivity', { item })
      }}
    >
      <Text style={{ ...human.footnoteWhite }}>Edit Activity</Text>
    </Button>
  )

  const renderActionButtons = () => {
    // console.tron.log(userId, ownerId)
    if (check.equal(userId, ownerId)) {
      return <></>
      // return renderActionButtonEdit()
    }

    switch (data.isAttending) {
      case ACTIVITY_ATTENDANCE.YES.value:
        return (
          <>
            {renderActionButtonMaybe()}
            <Divider vertical />
            {renderActionButtonNo()}
          </>
        )
      case ACTIVITY_ATTENDANCE.MAYBE.value:
        return (
          <>
            {renderActionButtonYes()}
            <Divider vertical />
            {renderActionButtonNo()}
          </>
        )
      case ACTIVITY_ATTENDANCE.NO.value:
        return (
          <>
            {renderActionButtonYes()}
            <Divider vertical />
            {renderActionButtonMaybe()}
          </>
        )
      default:
        return (
          <>
            {renderActionButtonYes()}
            <Divider vertical />
            {renderActionButtonMaybe()}
            <Divider vertical />
            {renderActionButtonNo()}
          </>
        )
    }
  }

  const renderAttendCalloutText = () => {
    if (check.equal(userId, ownerId)) {
      return <></>
      // return renderActionButtonEdit()
    }

    switch (data.isAttending) {
      case ACTIVITY_ATTENDANCE.YES.value:
      case ACTIVITY_ATTENDANCE.MAYBE.value:
      case ACTIVITY_ATTENDANCE.NO.value:
        return <Text style={{ ...human.caption1, color: iOSColors.gray }}>You may still change your participation status to</Text>
      default:
        return <Text style={{ ...human.caption1, color: iOSColors.gray }}>Attend activity?</Text>
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Block style={viewStyles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Block flex space='between'>
          <Block>
            <Block row space='between'>
              <Block>
                <Text style={{ ...human.title2, ...systemWeights.bold }}>
                  {title}
                </Text>
                <Divider small />
                <Text style={{ ...human.footnote }}>
                  {description}
                </Text>
              </Block>
              <Block middle width={80}>
                <AttendanceIcon data={data} size={50} outline />
              </Block>
            </Block>
            <Divider large />
            {renderOccurrenceDetails()}
            <Divider small />
            <FlatList
              data={items}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => <DetailsLineItem {...item} />}
            />
            {renderAttendanceDetails()}
          </Block>
        </Block>
        <Block center>
          <Divider />
          {renderAttendCalloutText()}
          <Divider />
          <Block row>
            {renderActionButtons()}
          </Block>
        </Block>
      </ScrollView>
    </Block>
  )
}

ActivityScreen.navigationOptions = ({ navigation, screenProps }) => {
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: galioTheme.SIZES.BASE
  },
  changeStatusButton: {
    height: 60,
    width: 60
  }
})

export default ActivityScreen
