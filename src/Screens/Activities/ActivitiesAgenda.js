import _ from 'lodash'
import React, { Component } from 'react'
import { Platform, Alert, StyleSheet, View, Text, TouchableOpacity, RefreshControl } from 'react-native'
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars'
import { Block } from 'galio-framework'
import moment from 'moment'

import { Icon } from '../../Icons'
import { CALENDAR_INPUT_TIME_FORMAT } from '../../Constants'
const themeColor = '#00AAAF'
const lightThemeColor = '#EBF9F9'

const duration = (startTime, endTime) => {
  const diffInMinutes = moment(endTime.trim(), CALENDAR_INPUT_TIME_FORMAT).diff(moment(startTime.trim(), CALENDAR_INPUT_TIME_FORMAT), 'minutes')
  const hours = Math.floor(diffInMinutes / 60)
  const minutes = diffInMinutes % 60

  if (hours === 0) {
    return `${minutes}m`
  }

  if (minutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${minutes}m`
}

// const ITEMS = [
//   { title: dates[0], data: [{ hour: '12am', duration: '1h', title: 'Ashtanga Yoga' }] },
//   { title: dates[1], data: [{ hour: '4pm', duration: '1h', title: 'Pilates ABC' }, { hour: '5pm', duration: '1h', title: 'Vinyasa Yoga' }] },
//   { title: dates[2], data: [{ hour: '1pm', duration: '1h', title: 'Ashtanga Yoga' }, { hour: '2pm', duration: '1h', title: 'Deep Streches' }, { hour: '3pm', duration: '1h', title: 'Private Yoga' }] },
//   { title: dates[3], data: [{ hour: '12am', duration: '1h', title: 'Ashtanga Yoga' }] },
//   { title: dates[4], data: [{}] },
//   { title: dates[5], data: [{ hour: '9pm', duration: '1h', title: 'Pilates Reformer' }, { hour: '10pm', duration: '1h', title: 'Ashtanga' }, { hour: '11pm', duration: '1h', title: 'TRX' }, { hour: '12pm', duration: '1h', title: 'Running Group' }] },
//   { title: dates[6], data: [{ hour: '12am', duration: '1h', title: 'Ashtanga Yoga' }] },
//   { title: dates[7], data: [{}] },
//   { title: dates[8], data: [{ hour: '9pm', duration: '1h', title: 'Pilates Reformer' }, { hour: '10pm', duration: '1h', title: 'Ashtanga' }, { hour: '11pm', duration: '1h', title: 'TRX' }, { hour: '12pm', duration: '1h', title: 'Running Group' }] },
//   { title: dates[9], data: [{ hour: '1pm', duration: '1h', title: 'Ashtanga Yoga' }, { hour: '2pm', duration: '1h', title: 'Deep Streches' }, { hour: '3pm', duration: '1h', title: 'Private Yoga' }] },
//   { title: dates[10], data: [{ hour: '12am', duration: '1h', title: 'Ashtanga Yoga' }] }
// ]

export default class ActivitiesAgenda extends Component {
  constructor (props) {
    super(props)

    this.state = {
      refreshing: false
    }
  }

  buttonPressed () {
    Alert.alert('show more')
  }

  onPressItem (item) {
    if (this.props.onPressItem) {
      this.props.onPressItem(item)
    }
  }

  onRefresh () {
    // this.setState({ refreshing: true })
    if (this.props.onLoad) {
      this.props.onLoad()
        .then(() => {
          if (this.props.onRefresh) {
            this.props.onRefresh()
          }
          this.setState({ refreshing: false })
        })
    }
  }

  renderEmptyItem () {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned</Text>
      </View>
    )
  }

  renderItem ({ item }) {
    if (_.isEmpty(item)) {
      return this.renderEmptyItem()
    }

    return (
      <TouchableOpacity
        onPress={() => this.onPressItem(item)}
        style={styles.item}
      >
        {/* <Text style={styles.itemHourText}>{`${item.startTime} - ${item.endTime}`}</Text> */}
        <Block>
          <Text style={styles.itemHourText}>{item.startTime}</Text>
          <Text style={styles.itemDurationText}>{duration(item.startTime, item.endTime)}</Text>
        </Block>
        <Block flex row middle space='between'>
          <Block flex row middle space='between'>
            <Block>
              <Text style={styles.itemTitleText}>{item.name}</Text>
              <Text style={styles.itemSubtitleText}>{item.venue}</Text>
            </Block>
            <Block row>
              {this.props.renderAttendanceIcon(item)}
              <Block width={10} />
            </Block>
          </Block>
          <Block center style={styles.disclosure}>
            <Icon name='chevron-right' size={20} color='gray' />
          </Block>
        </Block>
      </TouchableOpacity>
    )
  }

  getMarkedDates () {
    // return this.props.data.map(({ date, data }) => ({
    //   dots: data.map(item => ({ color: 'blue' }))
    // }))
    const marked = {}
    this.props.data.forEach(item => {
      // NOTE: only mark dates with data
      if (item.data && item.data.length > 0 && !_.isEmpty(item.data[0])) {
        marked[item.title] = { marked: true }
      }
    })
    return marked
  }

  getTheme () {
    const disabledColor = 'grey'

    return {
      // arrows
      arrowColor: 'black',
      arrowStyle: { padding: 0 },
      // month
      monthTextColor: 'black',
      textMonthFontSize: 16,
      textMonthFontFamily: 'HelveticaNeue',
      textMonthFontWeight: 'bold',
      // day names
      textSectionTitleColor: 'black',
      textDayHeaderFontSize: 12,
      textDayHeaderFontFamily: 'HelveticaNeue',
      textDayHeaderFontWeight: 'normal',
      // dates
      dayTextColor: themeColor,
      textDayFontSize: 18,
      textDayFontFamily: 'HelveticaNeue',
      textDayFontWeight: '500',
      textDayStyle: { marginTop: Platform.OS === 'android' ? 2 : 4 },
      // selected date
      selectedDayBackgroundColor: themeColor,
      selectedDayTextColor: 'white',
      // disabled date
      textDisabledColor: disabledColor,
      // dot (marked date)
      dotColor: themeColor,
      selectedDotColor: 'white',
      disabledDotColor: disabledColor,
      dotStyle: { marginTop: -2 }
    }
  }

  render () {
    if (this.props.data.length === 0) {
      return <></>
    }

    return (
      <CalendarProvider
        showTodayButton
        disabledOpacity={0.6}
        // theme={{
        //   todayButtonTextColor: themeColor
        // }}
        // todayBottomMargin={16}
      >
        {this.props.weekView
          ? (
            <WeekCalendar
              firstDay={1}
              markedDates={this.getMarkedDates()}
            />
          )
          : (
            <ExpandableCalendar
              // horizontal={false}
              // hideArrows
              // disablePan
              // hideKnob
              // initialPosition={ExpandableCalendar.positions.OPEN}
              // calendarStyle={styles.calendar}
              // headerStyle={styles.calendar} // for horizontal only
              // disableWeekScroll
              // theme={this.getTheme()}
              firstDay={1}
              markingType='dot'
              // markedDates={this.getMarkedDates()} // {'2019-06-01': {marked: true}, '2019-06-02': {marked: true}, '2019-06-03': {marked: true}};
              leftArrowImageSource={require('../../../assets/images/previous.png')}
              rightArrowImageSource={require('../../../assets/images/next.png')}
              markedDates={this.getMarkedDates()}
            />
          )}
        <AgendaList
          sections={this.props.data}
          extraData={this.props}
          renderItem={this.renderItem.bind(this)}
          refreshing={this.state.refreshing}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />}
          // sectionStyle={styles.section}
        />
      </CalendarProvider>
    )
  }
}

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize'
  },
  item: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row'
  },
  itemTimeContainer: {
    justifyContent: 'center',
    width: 40
  },
  itemHourText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center'
  },
  itemDurationText: {
    color: '#009cde',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center'
  },
  itemTitleText: {
    color: 'black',
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16
  },
  itemSubtitleText: {
    color: 'black',
    marginLeft: 16,
    fontSize: 12
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14
  },
  disclosure: {
    width: 20
  }
})
