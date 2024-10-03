import React, { useEffect } from 'react'
import { StyleSheet, Text, Image } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'
import moment from 'moment'

import { Container, Listing, NoData, Icon } from '../Stateless'
import { statusColor, STATUS_TEXTS } from '../../Utils/Visitor'
import NavigationService from '../../Navigation'
const DATE_FORMAT = 'DD MMM'
const TIME_FORMAT = 'HH:mm'

const VisitorListing = () => {
  const flat = useStoreState(state => state.app.flat)
  const load = useStoreActions(actions => actions.visitors.load)
  const { data, status, failureReason, license } = useStoreState(state => ({ ...state.visitors }))
  console.log(data, "data at visitors >>>");

  const onLoad = () => {
    return load({ startDate: null, endDate: null })
  }

  useEffect(() => {
    onLoad()
  }, [])

  return (
    <Block style={styles.container}>
      <Container
        status={status}
        failureReason={failureReason}
        license={license}
        data={data}
        onLoad={() => onLoad()}
        showSkeletonLoader
      >
        <Listing
          items={data}
          status={status}
          thumbnailContentComponent={(item) => <Thumbnail {...item} />}
          itemContentComponent={(item) => <ItemContent {...item} />}
          onLoad={onLoad}
          onPressItem={(item) => {
            NavigationService.navigate('Visitor', { item })
          }}
          noDataComponent={() => <NoData text='No visitors found' />}
        />
      </Container>
    </Block>
  )
}

const Thumbnail = ({ image, status }) => {
  const _status = check.not.assigned(status) ? STATUS_TEXTS[0] : STATUS_TEXTS[Number(status) - 1]
  return (
    <Block>
      {
        check.not.assigned(image)
          ? <Icon name='account-clock-outline' size={32} color={iOSColors.lightGray} />
          : <Image source={{ uri: image }} style={styles.image} />
      }
      <Block style={{ backgroundColor: statusColor(status), padding: 5 }}>
        <Text style={{ ...human.caption2White, textTransform: 'uppercase', textAlign: 'center' }}>
          {_status}
        </Text>
      </Block>
    </Block>
  )
}

const ItemContent = (props) => {
  const {
    name,
    description,
    entryDateTime,
    exitDateTime
  } = props

  return (
    <Block style={styles.item}>
      <Text
        numberOfLines={1}
        style={{ ...human.body, ...systemWeights.bold }}
      >
        {name}
      </Text>
      {/* <Text style={{ ...human.footnote, marginTop: 3, color: iOSColors.gray }}>
        {contact}
      </Text> */}
      <Text numberOfLines={1} style={{ ...human.caption1, marginTop: 5 }}>
        {description}
      </Text>
      <Block row style={{ marginTop: 30 }}>
        <Block row middle>
          <Icon name='clock-in' size={24} />
          <Block>
            <Text style={{ fontSize: 9 }}>
              {moment(entryDateTime).format(DATE_FORMAT)}
            </Text>
            <Text style={{ ...human.caption2 }}>
              {moment(entryDateTime).format(TIME_FORMAT)}
            </Text>
          </Block>
        </Block>
        <Block width={20} />
        <Block row middle>
          {
            check.not.assigned(exitDateTime)
              ? <></>
              : (
                <>
                  <Icon name='clock-out' size={24} />
                  <Block>
                    <Text style={{ fontSize: 9 }}>
                      {moment(exitDateTime).format(DATE_FORMAT)}
                    </Text>
                    <Text style={{ ...human.caption2 }}>
                      {moment(exitDateTime).format(TIME_FORMAT)}
                    </Text>
                  </Block>
                </>
              )
          }
        </Block>
      </Block>
    </Block>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100
  },
  image: {
    height: 100,
    resizeMode: 'cover',
    width: 100
  },
  item: {
    height: 120,
    paddingVertical: 16,
    paddingHorizontal: 16
  },
  disclosure: {
    width: 40
  }
})

export default VisitorListing
