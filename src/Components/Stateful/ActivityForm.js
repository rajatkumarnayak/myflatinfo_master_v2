import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, ScrollView, Dimensions, Keyboard } from 'react-native'
import { Block, theme as galioTheme, Button } from 'galio-framework'
import { Picker } from 'native-base'
import { iOSColors, human } from 'react-native-typography'
import { useStoreActions } from 'easy-peasy'
import check from 'check-types'
import moment from 'moment'

import { Divider, DatePicker, Input } from '../Stateless'
import { Icon } from '../../Icons'
import viewStyles from '../../Styles/ViewStyles'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import useTheme from '../../Themes/Context'
import NavigationService from '../../Navigation'
import { ApiService } from '../../Store'
import { BOOKING_DEFAULT_START_DATE, API_REQUEST_DATE_FORMAT } from '../../Constants'
import { enumerateTimeDuration } from '../../Utils/Utils'

const { height } = Dimensions.get('window')
const timeDurations = enumerateTimeDuration()

const Label = ({ children }) => <Text style={{ ...human.footnote }}>{children}</Text>

const ActivityForm = ({ data, isEdit, submitButtonText }) => {
  const { id, name, description, venue, startDate, endDate, startTime, endTime } = data ||
    {
      id: null,
      name: null,
      description: null,
      venue: null,
      startDate: BOOKING_DEFAULT_START_DATE,
      endDate: BOOKING_DEFAULT_START_DATE,
      startTime: moment().add(1, 'hours').format('HH:00'),
      endTime: moment().add(1, 'hours').add(30, 'minutes').format('HH:00')
    }
  const { theme } = useTheme()
  const loadList = useStoreActions(actions => actions.activities.load)
  const [_name, setName] = useState(name)
  const [_description, setDescription] = useState(description)
  const [titleFeedback, setTitleFeedback] = useState(null)
  const [descriptionFeedback, setDescriptionFeedback] = useState(null)
  const [_venue, setVenue] = useState(venue)
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
    const response = await ApiService.putActivityItemData(payload)
    console.log(response)

    if (response.ok) {
      loadList({ startDate: null, endDate: null })
      NavigationService.goBack()
    }
    setIsSubmitting(false)
  }

  async function update (payload) {
    const response = await ApiService.updateActivityItemData(payload)
    console.log(response)

    if (response.ok) {
      loadList({ startDate: null, endDate: null })
      NavigationService.goBack()
    }
    setIsSubmitting(false)
  }

  const isFormValid = () => {
    Keyboard.dismiss()

    if (check.not.assigned(_name) || check.emptyString(_name)) {
      setTitleFeedback('error')
      return false
    }

    if (check.not.assigned(_description) || check.emptyString(_description)) {
      setDescriptionFeedback('error')
      return false
    }

    return true
  }

  const onSubmit = () => {
    if (!isFormValid()) {
      return
    }

    const payload = {
      name: _name,
      description: _description,
      venue: _venue,
      startDate: moment(_startDate).format(API_REQUEST_DATE_FORMAT),
      endDate: moment(_endDate).format(API_REQUEST_DATE_FORMAT),
      startTime: _startTime,
      endTime: _endTime
    }

    setIsSubmitting(true)

    if (isEdit) {
      update({ ...payload, id })
    } else {
      create(payload)
    }
  }

  useEffect(() => {
    setEndTimeList(timeDurations
      .concat([timeDurations[0]]) // add '00:00' to end of list
      .slice(timeDurations.indexOf(_startTime) + 1))
  }, [_startTime])

  useEffect(() => {
    if (Number(_startTime.split(':').join('')) >= Number(_endTime.split(':').join(''))) {
      setEndTime(endTimeList[0])
    }
  }, [endTimeList])

  return (
    <Block style={styles.container}>
      <ScrollView>
        <Divider />
        <Block style={styles.section}>
          <Label>Title</Label>
          <Input
            returnKeyType='next'
            onChangeText={text => setName(text)}
            value={_name}
            borderless={titleFeedback !== 'error'}
            placeholder='A short title about the activity'
            style={titleFeedback === 'error' && styles.inputError}
          />
        </Block>
        <Divider />
        <Block style={styles.section}>
          <Label>Description</Label>
          <Input
            returnKeyType='next'
            onChangeText={text => setDescription(text)}
            value={_description}
            multiline
            numberOfLines={4}
            borderless={descriptionFeedback !== 'error'}
            placeholder='Detailed information about the activity'
            style={[styles.textarea, descriptionFeedback === 'error' && styles.inputError]}
            textAlignVertical='top'
          />
        </Block>
        <Divider />
        <Block style={styles.section}>
          <Label>Venue</Label>
          <Input
            returnKeyType='next'
            onChangeText={text => setVenue(text)}
            value={_venue}
            borderless
            placeholder='Where will the activity take place?'
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
                setStartDate(s)
                setEndDate(e)
              }}
            />
          </Block>
        </Block>
        <Divider />
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
                >
                  {endTimeList.map((time) => <Picker.Item label={time} value={time} key={time} />)}
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
          <Text style={{ ...human.bodyWhite }}>{submitButtonText || 'Create Activity'}</Text>
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
  textarea: {
    borderRadius: 6,
    height: 100,
    ...elevationShadowStyle({ elevation: 2 })
  },
  buttonGroupContainer: {
    borderRadius: 6,
    borderWidth: 0,
    marginTop: 0,
    marginLeft: 0,
    overflow: 'hidden',
    width: '100%',
    ...elevationShadowStyle({ elevation: 2 })
  },
  imageContainer: {
    borderRadius: 6,
    height: height / 3,
    overflow: 'hidden',
    ...elevationShadowStyle({ elevation: 2 })
  },
  photoName: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 20,
    left: 20,
    ...human.caption2White
  },
  removeImage: {
    opacity: 0.5,
    position: 'absolute',
    top: 20,
    right: 20
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

export default ActivityForm
