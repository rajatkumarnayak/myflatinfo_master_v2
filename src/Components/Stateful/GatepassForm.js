import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, ScrollView, Keyboard } from 'react-native'
import { Block, theme as galioTheme, Button } from 'galio-framework'
// import { ButtonGroup } from 'react-native-elements'
import { Picker } from 'native-base'
import { iOSColors, human } from 'react-native-typography'
import { useStoreActions } from 'easy-peasy'
import check from 'check-types'
import moment from 'moment'

import { Divider, DatePicker, Input, Icon } from '../Stateless'
import viewStyles from '../../Styles/ViewStyles'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import useTheme from '../../Themes/Context'
import { ApiService } from '../../Store'
import { GATEPASS_DEFAULT_START_DATE, GATEPASS_DEFAULT_END_DATE, GATEPASS_DEFAULT_START_TIME, GATEPASS_DEFAULT_END_TIME, API_REQUEST_DATE_FORMAT, CALENDAR_DATE_FORMAT } from '../../Constants'
import { enumerateTimeDuration } from '../../Utils/Utils'

const timeDurations = enumerateTimeDuration()

const Label = ({ children }) => <Text style={{ ...human.footnote }}>{children}</Text>
// const VisitorCountIncrementButton = () => <Icon name='minus' />
// const VisitorCountDecrementButton = () => <Icon name='plus' />
// const visitorCountButtons = [{ element: VisitorCountIncrementButton }, { element: VisitorCountDecrementButton }]

const GatepassForm = ({ data, submitButtonText, onSuccess }) => {
  const { primaryVisitorName, startDate, endDate, startTime, endTime } = data ||
    {
      primaryVisitorName: '',
      startDate: GATEPASS_DEFAULT_START_DATE,
      endDate: GATEPASS_DEFAULT_END_DATE,
      startTime: GATEPASS_DEFAULT_START_TIME,
      endTime: GATEPASS_DEFAULT_END_TIME
    }
  const { theme } = useTheme()
  const loadList = useStoreActions(actions => actions.gatepasses.load)
  const [startDateSelected, setstartDateSelected] = useState(true)
  const [endDateSelected, setendDateSelected] = useState(true)
  const [_name, setName] = useState(primaryVisitorName)
  const [nameFeedback, setNameFeedback] = useState(null)
  const [_startDate, setStartDate] = useState(startDate)
  const [_endDate, setEndDate] = useState(endDate)
  const [_startTime, setStartTime] = useState(startTime)
  const [_endTime, setEndTime] = useState(endTime)
  const [startTimeList, setStartTimeList] = useState(timeDurations)
  const [endTimeList, setEndTimeList] = useState(timeDurations
    .slice(1) // remove first item '00:00'
    .concat([timeDurations[0]]) // add '00:00' to end of list
    .slice(timeDurations.indexOf(_startTime)) // remove all items lesser than the start time
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function create (payload) {
    const response = await ApiService.putGatepassItemData(payload)

    if (response.ok) {
      loadList({ startDate: null, endDate: null })

      if (check.assigned(onSuccess)) {
        onSuccess()
      }
    }
    setIsSubmitting(false)
  }

  // const onPressVisitorCountSpinner = (index) => {
  //   let newCount = index === 0
  //     ? _secondaryVisitorsCount - 1
  //     : _secondaryVisitorsCount + 1

  //   if (newCount <= 0) {
  //     newCount = 0
  //   }
  //   if (newCount >= 4) {
  //     newCount = 4
  //   }

  //   setsecondaryVisitorsCount(newCount)
  // }

  const isFormValid = () => {
    Keyboard.dismiss()

    if (check.not.assigned(_name) || check.emptyString(_name)) {
      setNameFeedback('error')
      return false
    }

    return true
  }

  const onSubmit = () => {
    if (!isFormValid()) {
      return
    }

    const payload = {
      primaryVisitor: _name,
      startDate: moment(_startDate).format(API_REQUEST_DATE_FORMAT),
      endDate: moment(_endDate).format(API_REQUEST_DATE_FORMAT),
      startTime: _startTime,
      endTime: _endTime
      // status: 0
    }

    setIsSubmitting(true)

    create(payload)
  }
  const onSelectDate = (s, e) => {
    if (moment(e).format(CALENDAR_DATE_FORMAT) === moment(new Date()).format(CALENDAR_DATE_FORMAT)) {
      setendDateSelected(true)
    } else {
      setendDateSelected(false)
    }
    if (moment(s).format(CALENDAR_DATE_FORMAT) === moment(new Date()).format(CALENDAR_DATE_FORMAT)) {
      setstartDateSelected(true)
    } else {
      setstartDateSelected(false)
    }
    setStartDate(s)
    setEndDate(e)
  }
  useEffect(() => {
      setEndTimeList(timeDurations
        .concat([timeDurations[0]]) // add '00:00' to end of list
        .slice(timeDurations.indexOf(_startTime) + 1))
   
  }, [_startTime])

  useEffect(() => {
    if (endDateSelected) {
      if (Number(_startTime.split(':').join('')) >= Number(_endTime.split(':').join(''))) {
        setEndTime(endTimeList[0])
      }
    } else {
      setEndTime(startTimeList[0])
    }
  }, [endTimeList])

  useEffect(() => {
    if (_endDate !== _startDate && _endDate !== moment().format(CALENDAR_DATE_FORMAT)) {
      setEndTimeList(timeDurations) // add '00:00' to end of list
    }
  }, [_endDate])
  useEffect(() => {
    if (startDateSelected) {
      setStartTime(startTime) // add '00:00' to end of list
    }else{
      setStartTime(timeDurations[0])
    }
  }, [_startDate])
  return (
    <Block style={styles.container}>
      <ScrollView>
        <Divider />
        <Block style={styles.section}>
          <Label>Name of primary visitor</Label>
          <Input
            returnKeyType='next'
            onChangeText={text => setName(text)}
            value={_name}
            placeholder=''
            style={nameFeedback === 'error' && styles.inputError}
          />
        </Block>
        <Divider />
        <Block style={styles.section}>
          <Label>Dates</Label>
          <Divider small />
          <Block style={viewStyles.pickerContainer}>
            <DatePicker
              initialRange={[_startDate, _endDate]}
              onSelect={(s, e) => {
                onSelectDate(s, e)
              }}
            />
          </Block>
        </Block>
        <Divider large />
        <Block style={styles.section}>
          <Block row middle>
            <Block flex>
              <Label>Start time</Label>
              <Divider small />
              <Block style={viewStyles.pickerContainer}>
                <Picker
                  mode='dropdown'
                  iosHeader='Start time'
                  iosIcon={<Icon name='arrow-down' />}
                  style={{ width: undefined }}
                  selectedValue={_startTime}
                  onValueChange={(value) => {
                    setStartTime(value)
                  }}
                >
                  {startTimeList.map((time) => <Picker.Item label={time} value={time} key={time} />)}
                </Picker>
              </Block>
            </Block>
            <Block width={20} />
            <Block flex>
              <Label>End time</Label>
              <Divider small />
              <Block style={viewStyles.pickerContainer}>
                <Picker
                  mode='dropdown'
                  iosHeader='Start time'
                  iosIcon={<Icon name='arrow-down' />}
                  style={{ width: undefined }}
                  selectedValue={_endTime}
                  onValueChange={(value) => {
                    setEndTime(value)
                  }}
                >{endDateSelected ? endTimeList.map((time) => <Picker.Item label={time} value={time} key={time} />)
                    : startTimeList.map((time) => <Picker.Item label={time} value={time} key={time} />)}
                </Picker>
              </Block>
            </Block>
          </Block>
        </Block>
        <Divider large />
        <Divider large />
      </ScrollView>
      <Block middle style={viewStyles.submitButtonContainer}>
        <Button
          onPress={onSubmit}
          loading={isSubmitting}
          round
          color={theme.colors.primary}
        >
          <Text style={{ ...human.subheadWhite }}>{submitButtonText || 'Create Gate Pass'}</Text>
        </Button>
      </Block>
    </Block>
  )
}

const styles = StyleSheet.create({
  container: {
    ...viewStyles.mainContainer,
    paddingBottom: 0
  },
  section: {
    marginHorizontal: galioTheme.SIZES.BASE
  },
  inputError: {
    backgroundColor: 'rgba(255, 89, 89, .10)',
    borderColor: galioTheme.COLORS.ERROR
  },
  buttonGroupContainer: {
    borderRadius: 6,
    borderWidth: 0,
    marginTop: 0,
    marginLeft: 0,
    overflow: 'hidden',
    width: 100,
    ...elevationShadowStyle({ elevation: 2 })
  },
  submitButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  submitButton: {
    margin: galioTheme.SIZES.BASE
  },
  timePair: {
    borderColor: iOSColors.gray,
    borderWidth: 1,
    borderRadius: 3,
    margin: 5,
    paddingHorizontal: 5,
    paddingVertical: 5
  }
})

export default GatepassForm
