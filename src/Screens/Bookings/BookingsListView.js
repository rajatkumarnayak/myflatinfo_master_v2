import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { human, iOSColors, systemWeights } from 'react-native-typography'
import moment from 'moment'
import check from 'check-types'

import { Listing, NoData, Divider } from '../../Components/Stateless'
import viewStyles from '../../Styles/ViewStyles'
import NavigationService from '../../Navigation'
import colors from '../../Themes/Colors'

const statusColor = (status) => {
  if (status === 1 || status === 2) {
    return iOSColors.green
  }

  if (status === 6) {
    return iOSColors.blue
  }

  return iOSColors.red
}

const BookingsListView = ({ data, networkStatus, onLoad }) => {
  const onPressItem = (item) => {
    NavigationService.navigate(
      'Booking',
      {
        item: data.find(({ id }) => item.id === id)
      }
    )
  }

  return (
    <Block style={viewStyles.mainContainer}>
      <Listing
        items={data}
        networkStatus={networkStatus}
        onLoad={onLoad}
        onPressItem={onPressItem}
        itemContentComponent={(item) => <ItemContentComponent data={item} />}
        thumbnailContentComponent={({ color }) => <Block width={10} style={{ backgroundColor: color }} />}
        noDataComponent={() => <NoData text='No bookings found' />}
      />
    </Block>
  )
}

const ItemContentComponent = ({ data }) => {
  const { name, startDate, endDate, caption, status, statusText, bookingType } = data

  return (
    <Block style={styles.item}>
      <Text
        numberOfLines={1}
        style={{ ...human.body, ...systemWeights.semibold }}
      >
        {name}
      </Text>
      <Divider small />
      <Text
        numberOfLines={1}
        style={{ ...human.footnote, color: iOSColors.gray }}
      >
        {bookingType === 'hourly'
          ? caption
          : `${startDate} - ${endDate}, ${caption}`}
      </Text>
      <Divider small />
      <Block row>
        <Block left>
          <Text style={styles.tag}>{bookingType}</Text>
        </Block>
        <Divider vertical small />
        <Block left>
          <Text
            style={[
              styles.tag,
              styles.status,
              {
                backgroundColor: statusColor(status)
              }]}
          >
            {statusText}
          </Text>
        </Block>
      </Block>
    </Block>
  )
}

const styles = StyleSheet.create({
  item: {
    marginHorizontal: galioTheme.SIZES.BASE,
    marginVertical: galioTheme.SIZES.BASE
  },
  tag: {
    ...human.caption2,
    backgroundColor: iOSColors.customGray,
    borderRadius: 10,
    fontSize: 8,
    paddingVertical: 1,
    paddingHorizontal: 10,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  status: {
    color: colors.white
  }
})

export default BookingsListView
