import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Modal from 'react-native-modal'
import { Picker } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'

import { Calendar } from '.'

export const INPUT_DATE_FORMAT = 'YYYY-MM-DD'
const DISPLAY_DATE_FORMAT = 'DD MMM'

const toDisplay = (d1) => (
  // alert([d1])
  [d1]
    .map(d => moment(d, INPUT_DATE_FORMAT).format(DISPLAY_DATE_FORMAT))
    .join(' - ')
)
const toDisplays = (d1, d2) => (
  [d1, d2]
    .map(d => moment(d, INPUT_DATE_FORMAT).format(DISPLAY_DATE_FORMAT))
    .join(' - ')
)
const DateRangePicker = (props) => {
  const { initialRange, onSuccess, theme, type } = props
  const [displayRange, setDisplayRange] = useState(toDisplay(initialRange[0]))
  const [displayRanges, setDisplayRanges] = useState(toDisplays(initialRange[0], initialRange[1]))
  const [isModalVisible, setModalVisibility] = useState(false)

  const _onSucess = (startDate, endDate) => {
 
    if (type === 'single') {
      onSuccess(startDate)
      setDisplayRange(toDisplay(startDate, type))
    } else {
      onSuccess(startDate, endDate)
      setDisplayRanges(toDisplays(startDate, endDate, type))
    }

    onHideModal()
  }

  const onHideModal = () => setModalVisibility(false)

  useEffect(() => {
    if (type === 'single') {
      setDisplayRange(toDisplay(initialRange[0], type))
    } else {
      setDisplayRanges(toDisplays(initialRange[0], initialRange[1], type))
    }
  }, [initialRange])

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisibility(true)}
      >
        <Picker
          mode='dropdown'
          iosIcon={<Icon name='chevron-down' />}
          style={{ width: undefined }}
        />
        <Text numberOfLines={1} style={styles.displayText}>{type === 'single' ? displayRange : displayRanges}</Text>
      </TouchableOpacity>
      <Modal
        animationType='slide'
        backdropOpacity={0.1}
        isVisible={isModalVisible}
        onModalHide={onHideModal}
        onBackButtonPress={onHideModal}
        onBackdropPress={onHideModal}
        style={styles.modal}>
        <View>
          <Calendar
            initialRange={initialRange}
            onSuccess={_onSucess}
            theme={theme || { markColor: 'black', markTextColor: 'white' }}
            type={type}
          />
        </View>
      </Modal>
    </>
  )
}
const styles = StyleSheet.create({
  displayText: {
    fontSize: 15,
    position: 'absolute',
    top: 15,
    left: 8,
    width: '90%'
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0
  }
})

export default DateRangePicker
