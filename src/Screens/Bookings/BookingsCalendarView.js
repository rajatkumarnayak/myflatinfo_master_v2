import React, { useState, useEffect, useRef } from 'react'
import { Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import check from 'check-types'
import moment from 'moment'

import { Divider, Panel } from '../../Components/Stateless'
import Agenda from './Agenda'
import NavigationService from '../../Navigation'
import viewStyles from '../../Styles/ViewStyles'
import { enumerateEventsByDate, groupEventsByDate } from '../../Utils/Utils'

const uniqueBookingArea = (acc, currentItem, idx, src) => {
  const isAreaPresentInAccumulator = check.emptyArray(acc)
    ? false
    : acc.some(item => item.typeId === currentItem.typeId)

  // find if the area is already saved in the accumulator
  if (!isAreaPresentInAccumulator) {
    // if not already saved, add the area to the accumulator
    acc.push(currentItem)
  }

  return acc
}

const BookingsCalendarView = ({ data, networkStatus, onLoad }) => {
  const [_data, setData] = useState([])
  const [items, setItems] = useState({})
  const panelRef = useRef()

  const onDayPress = (_items) => {
    // alert(_items)
    setItems(_items)
    panelRef.current.show()
  }

  const onPressItem = (item) => {
    panelRef.current.hide()
    NavigationService.navigate(
      'Booking',
      {
        item: data.find(({ id }) => item.id === id)
      }
    )
  }

  useEffect(() => {
    if (check.nonEmptyArray(data)) {
      const result = data
        .reduce(enumerateEventsByDate, [])
        .reduce(groupEventsByDate, [])
        .map(({ date, data }) => ({ date, data: data.reduce(uniqueBookingArea, []) }))

      setData(result)
    }
  }, [data])

  return (
    <Block style={viewStyles.mainContainer}>
      <Agenda
        data={_data}
        onDayPress={onDayPress}
        onLoad={onLoad}
      />
      {/* <Panel
        ref={panelRef}
        animated
        height={260}
      >
        <Block style={styles.panelContent}>
          <FlatList
            data={items}
            renderItem={({ item, index }) => (
              <Facility
                data={item}
                index={index}
                onPress={onPressItem}
              />
            )}
            keyExtractor={item => item.id}
          />
        </Block>
      </Panel> */}
    </Block>
  )
}

const Facility = ({ data, index, onPress }) => {
  const { name, color } = data
  const startDate = moment(data.startDate)
  const endDate = moment(data.endDate)

  const date = () => {
    if (startDate.isSame(endDate)) {
      return startDate.format('DD MMM')
    }

    return `${startDate.format('DD MMM')} - ${endDate.format('DD MMM')}`
  }

  return (
    <>
      <TouchableOpacity onPress={() => onPress(data)}>
        <Block
          row
          space='between'
          style={styles.bookingAreaItem}
        >
          <Block row middle>
            <Block style={{ borderRadius: 10, backgroundColor: color, height: 40, width: 40 }} />
            <Block width={20} />
            <Block>
              <Text style={{ ...human.title3, ...systemWeights.bold }}>{name}</Text>
              <Text
                style={{ ...human.footnote, color: iOSColors.gray }}
              >
                {data.bookingType === 'hourly' ? data.caption : date()}
              </Text>
            </Block>

          </Block>
        </Block>
      </TouchableOpacity>
      <Divider />
    </>
  )
}

const styles = StyleSheet.create({
  panelContent: {
    padding: galioTheme.SIZES.BASE * 2
  }
})

export default BookingsCalendarView
