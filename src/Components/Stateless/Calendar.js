import React, { Component } from 'react'
import { Calendar as RNCalendar, defaultStyle } from 'react-native-calendars'

const XDate = require('xdate')

export default class Calendar extends Component {
  constructor (props) {
    super(props)

    this.state = { isFromDatePicked: false, isToDatePicked: false, markedDates: {} }
  }

  componentDidMount () { this.setupInitialRange() }

  onDayPress (day) {
    if (this.props.type === 'single') {
      this.props.onSelect(day.dateString)
      this.setupStartMarker(day)
    } else {
      if (!this.state.isFromDatePicked || (this.state.isFromDatePicked && this.state.isToDatePicked)) {
        this.setupStartMarker(day)
      } else if (!this.state.isToDatePicked) {
        const markedDates = { ...this.state.markedDates }
        const [mMarkedDates, range] = this.setupMarkedDates(this.state.fromDate, day.dateString, markedDates)
        if (range >= 0) {
          this.setState({ isFromDatePicked: true, isToDatePicked: true, markedDates: mMarkedDates })
          this.props.onSelect(this.state.fromDate, day.dateString)
        } else {
          this.setupStartMarker(day)
        }
      }
    }
  }

  setupStartMarker (day) {
    const markedDates = { [day.dateString]: { startingDay: true, color: this.props.theme.markColor, textColor: this.props.theme.markTextColor } }
    this.setState({ isFromDatePicked: true, isToDatePicked: false, fromDate: day.dateString, markedDates: markedDates })
  }

  setupMarkedDates (fromDate, toDate, markedDates) {
    const mFromDate = new XDate(fromDate)
    const mToDate = new XDate(toDate)
    const range = mFromDate.diffDays(mToDate)
    if (range >= 0) {
      if (range === 0) {
        markedDates = { [toDate]: { color: this.props.theme.markColor, textColor: this.props.theme.markTextColor } }
      } else {
        for (var i = 1; i <= range; i++) {
          const tempDate = mFromDate.addDays(1).toString('yyyy-MM-dd')
          if (i < range) {
            markedDates[tempDate] = { color: this.props.theme.markColor, textColor: this.props.theme.markTextColor }
          } else {
            markedDates[tempDate] = { endingDay: true, color: this.props.theme.markColor, textColor: this.props.theme.markTextColor }
          }
        }
      }
    }
    return [markedDates, range]
  }

  setupInitialRange () {
    if (!this.props.initialRange) return
    const [fromDate, toDate] = this.props.initialRange
    const markedDates = { [fromDate]: { startingDay: true, color: this.props.theme.markColor, textColor: this.props.theme.markTextColor } }
    const [mMarkedDates, range] = this.setupMarkedDates(fromDate, toDate, markedDates)
    this.setState({ markedDates: mMarkedDates, fromDate: fromDate })
  }

  render () {
    if (this.props.type === 'single') {
      return (
        <RNCalendar
          current={this.state.fromDate}
          onDayPress={(day) => { this.onDayPress(day) }}
          minDate={(new XDate()).toString('yyyy-MM-dd')}
          {...this.props}
        />
      )
    }

    return (
      <RNCalendar
        markingType='period'
        current={this.state.fromDate}
        markedDates={this.state.markedDates}
        onDayPress={(day) => { this.onDayPress(day) }}
        minDate={(new XDate()).toString('yyyy-MM-dd')}
        {...this.props}
      />
    )
  }
}

Calendar.defaultProps = {
  theme: { markColor: '#00adf5', markTextColor: '#ffffff' }
}
