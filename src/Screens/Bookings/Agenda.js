import React, { Component } from 'react'
import { StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { CalendarList } from 'react-native-calendars'
import viewStyles from '../../Styles/ViewStyles'

const lightThemeColor = '#EBF9F9'

export default class Agenda extends Component {
  constructor (props) {
    super(props)

    this.state = {
      refreshing: false
    }
  }

  onRefresh () {
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

  onDateChanged (/* date, updateSource */) {
    // console.warn('Agenda onDateChanged: ', date, updateSource);
    // fetch and set data for date + week ahead
  }

  onMonthChange (/* month, updateSource */) {
    // console.warn('Agenda onMonthChange: ', month, updateSource);
  }

  onDayPress (day) {
 
    // Shape of the day object
    // {
    //   "year": 2020,
    //   "month": 2,
    //   "day": 19,
    //   "timestamp": 1582070400000,
    //   "dateString": "2020-02-19"
    // }
    const { dateString } = day

    // do nothing if 'onDayPress' has not been passed
    if (!this.props.onDayPress) {
      return null
    }
    // alert(JSON.stringify(this.props.data[0].date +'--'+ dateString))
    // Now find the item in props.data that matches item's 'date' with 'dateString'
    const item = this.props.data.find(item => item.date === dateString)
    // if an item is found, return the 'data' property of the item
    // alert(JSON.stringify(this.props.data))

    if (item) {
      this.props.onDayPress(item.data)
    }
  }

  getMarkedDates () {
    // '2020-01-16': {
    //   periods: [
    //     { startingDay: true, endingDay: false, color: 'green' },
    //     { startingDay: true, endingDay: false, color: 'orange' }
    //   ]
    // },
    // '2020-01-17': {
    //   periods: [
    //     { startingDay: false, endingDay: true, color: 'green' },
    //     { startingDay: false, endingDay: true, color: 'orange' },
    //     { startingDay: true, endingDay: false, color: 'pink' }
    //   ]
    // },
    // '2020-01-18': {
    //   periods: [
    //     { startingDay: true, endingDay: true, color: 'orange' },
    //     { color: 'transparent' },
    //     { startingDay: false, endingDay: false, color: 'pink' }
    //   ]
    // }
    const mainData = this.props.data.filter((item ,index)=> item.data[0].statusText !== "Cancelled")
    console.log(mainData ,"mainData >>>>>");


     const markedDates = mainData
   .reduce((acc, item) => {
        const { date, data } = item
        console.log( date, data  ,"markedDates >>>>>")

        acc[date] = { periods: data }

        return acc
      }, {})

    return markedDates
  }

  getTheme () {
    return {
      // textDisabledColor: 'red',
      'stylesheet.calendar.main': {
        container: {
          ...viewStyles.fullScreenCalendar
        },
        monthView: {
          ...viewStyles.fullScreenCalendar
        }
      },
      'stylesheet.day.basic': {
        base: {
          width: 32,
          height: 32,
          alignSelf: 'center',
          justifyContent: 'center'
        },
        text: {
          alignSelf: 'center'
        }
      }
    }
  }

  render () {
    return (
      <ScrollView
        nestedScrollEnabled
        refreshing={this.state.refreshing}
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />}
      >
        <CalendarList
          style={styles.calendar}
          pastScrollRange={0}
          futureScrollRange={6}
          onDayPress={(day) => this.onDayPress(day)}
          markingType='multi-period'
          markedDates={this.getMarkedDates()}
          theme={this.getTheme()}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  calendar: {
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
  itemHourText: {
    color: 'black'
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  },
  itemTitleText: {
    color: 'black',
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16
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
  }
})
