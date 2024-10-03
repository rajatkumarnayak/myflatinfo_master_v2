import React, { useEffect, useState } from 'react'
import { Dimensions, TouchableOpacity, Text, Image, StyleSheet, FlatList } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'
import moment from 'moment'

import { Listing, Divider } from '../Stateless'
import { Icon } from '../../Icons'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import theme from '../../Themes/configs/default'
import colors from '../../Themes/Colors'

const { width } = Dimensions.get('screen')

const thumbMeasure = (width - 48 - 32) / 3

const Noticeboard = () => {
  const flat = useStoreState(state => state.app.flat)
  const load = useStoreActions(actions => actions.noticeboard.load)
  const { data, status } = useStoreState(state => ({ ...state.noticeboard }))
  console.log(data ,"notice data >>>>");
  const [_data, setData] = useState([])

  useEffect(() => {
    if (check.assigned(flat)) {
      load()
    }
  }, [flat])

  useEffect(() => {
    if (check.assigned(data)) {
      setData(data.map(item => ({
        ...item,
        subtitle: item.description,
        dateTime: moment(item.dateTime).format('DD MMM')
      })))
    }
  }, [data])

  if (check.emptyArray(data)) {
    return <></>
    return (
      <Block style={styles.item}>
        <Text style={{ ...human.caption2 }}>
          No items to display
        </Text>
      </Block>
    )
  }

  const renderNoData = () => {
    return <></>
    return (
      <>
        <Divider large />
        <Text style={{ ...human.caption2 }}>
          No items to display
        </Text>
      </>
    )
  }

  const Item = (item) => {
    const { title, description, dateTime } = item

    return (
      <Block flex row style={styles.item}>
        <Block middle style={styles.thumb}>
          <Icon name='bulletin-board' size={40} color={theme.colors.primary} />
        </Block>
        <Divider vertical />
        <Block flex style={{ alignSelf: 'center' }}>
          <Block row middle space='between'>
            <Text style={{ ...human.callout, ...systemWeights.semibold }}>
              {title}
            </Text>
            <Text style={{ ...human.caption2 }}>
              {dateTime}
            </Text>
          </Block>
          <Divider small />
          <Text style={{ ...human.caption1, color: iOSColors.gray }}>
            {description}
          </Text>
        </Block>
      </Block>
    )
  }

  return (
    <Block height={200}>
      <Listing
        items={_data}
        networkStatus={status}
        itemContentComponent={(item) => <Item {...item} />}
        noDataComponent={() => renderNoData()}
      />
      {/* <FlatList
        data={items}
        keyExtractor={({ item, index }) => index}
        renderItem={({ item, index }) => <Item item={item} key={index} />}
        horizontal
      /> */}
    </Block>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: galioTheme.SIZES.BASE
  },
  thumb: {
    height: 60,
    width: 40
  }
})

export default Noticeboard
