import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Modal from 'react-native-modal'
import { Picker } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'

import { Calendar } from '.'

export const INPUT_DATE_FORMAT = 'YYYY-MM-DD'
const DISPLAY_DATE_FORMAT = 'DD MMM YYYY'

const toDisplay = (d1, d2) => {
  const dates = d2 ? [d1, d2] : [d1]
  return dates
    .map(d => moment(d, INPUT_DATE_FORMAT).format(DISPLAY_DATE_FORMAT))
    .join(' - ')
}

const DatePicker = (props) => {
  const { initialRange, onSelect, theme } = props
  const [displayRange, setDisplayRange] = useState(toDisplay(initialRange[0], initialRange[1]))
  const [isModalVisible, setModalVisibility] = useState(false)

  const _onSucess = (startDate, endDate) => {
    onSelect(startDate, endDate)
    setDisplayRange(toDisplay(startDate, endDate))
    onHideModal()
  }

  const onHideModal = () => setModalVisibility(false)

  useEffect(() => {
    setDisplayRange(toDisplay(initialRange[0], initialRange[1]))
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
        <Text numberOfLines={1} style={styles.displayText}>{displayRange}</Text>
      </TouchableOpacity>
      <Modal
        animationType='slide'
        backdropOpacity={0.1}
        isVisible={isModalVisible}
        // swipeDirection={['down']}
        onModalHide={onHideModal}
        onBackButtonPress={onHideModal}
        onBackdropPress={onHideModal}
        style={styles.modal}
      >
        <View>
          <Calendar
            initialRange={initialRange}
            onSelect={_onSucess}
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

export default DatePicker
