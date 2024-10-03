import React, { useCallback, useState } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from 'react-native'
import { Block, theme } from 'galio-framework'
import { human, systemWeights, iOSColors } from 'react-native-typography'

import check from 'check-types'

import { Button, RupeeIcon, Loader, Divider } from './index'
import { Icon } from '../../Icons'
import argonTheme from '../../Themes/configs/argonTheme'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import { STATUS } from '../../Constants'
import viewStyles from '../../Styles/ViewStyles'
import { formattedMoney, formattedDate } from '../../Utils/Utils'

// const { width } = Dimensions.get('screen')

// const thumbMeasure = (width - 48 - 32) / 3
// const cardWidth = width - theme.SIZES.BASE * 2
const Status = ({ status,transactionNumber }) => {
  if (check.not.assigned(status)) {
    return <></>
  }

  return (
    <Block
      middle
      style={{
        ...styles.status,
        backgroundColor: status === 1 || transactionNumber != null
          ? iOSColors.green
          : iOSColors.orange
      }}
    >
      <Icon
        name={status === 1 || transactionNumber != null
          ? 'check-circle-outline'
          : 'alert-circle-outline'}
        size={40}
        color={iOSColors.white}
      />
    </Block>
  )
}

const Listing = ({
  items,
  status,
  onLoad,
  onRefresh,
  onPressItem,
  statusComponent,
  renderListHeader,
  renderListFooter,
  alwaysDisplayHeader = false,
  noDataComponent
}) => {
  const [refreshing, setRefreshing] = useState(false)

  const _onRefresh = useCallback(() => {
    onLoad()
      .then(() => {
        if (check.assigned(onRefresh)) {
          onRefresh()
        }
        setRefreshing(false)
      })
  }, [refreshing])

  const Item = ({ data, index }) => {
    const { amount, title, subtitle, date, tag,name, status,transactionNumber } = data
    //  console.log(data," data on the >>");
     return (
      <Block
        card
        style={[
          styles.card,
          index === 0 && styles.firstCard,
          index === (items.length - 1) && styles.lastCard
        ]}
      >
        <TouchableOpacity
          onPress={() => check.not.assigned(onPressItem)
            ? null
            : onPressItem(data)}
          style={{ flex: 1 }}
        >
          <Block flex row>
            {
              check.assigned(statusComponent)
                ? statusComponent(data)
                : <Status status={status}
                transactionNumber={transactionNumber}
                />
            }
            <Block flex row center space='between'>
              <Block flex style={styles.content}>
              <Text style={{ ...human.title3, ...systemWeights.bold ,textTransform: 'capitalize'}}>
                                {name}
                              </Text>
                <Block row>
                  <Block row center>
                    {
                      check.assigned(amount)
                        ? (
                          <Block flex middle row space='between'>
                            <Block row middle>
                              <RupeeIcon size={12} style={{ marginRight: 5 }} />
                              <Text style={{ ...human.title3, ...systemWeights.bold }}>
                                {formattedMoney(amount)}
                              </Text>
                            </Block>
                            <Text style={{ ...human.caption2 }}>
                              {formattedDate(date)}
                            </Text>
                          </Block>
                        )
                        : (
                          <Text style={{ ...human.body, ...systemWeights.semibold }}>
                            {title}
                          </Text>
                        )
                    }
                  </Block>
                </Block>
                <Text style={{ ...human.caption2, color: iOSColors.gray, marginTop: 5 }}>
                  {/* {subtitle} */}
                </Text>
               {tag ?  <Block left><Divider small /><Text style={styles.tag}>{tag}</Text></Block>: null}
              </Block>
            </Block>
            {
              check.assigned(onPressItem) && (
                <Block middle style={styles.disclosure}>
                  <Icon name='chevron-right' size={20} 
                  color={iOSColors.midGray} style={styles.chevron} />
                </Block>
              )
            }
          </Block>
        </TouchableOpacity>
      </Block>
    )
  }

  if (check.not.assigned(items)) {
    return <></>
  }

  if (check.emptyArray(items)) {
    if (alwaysDisplayHeader) {
      return (
        <>
          {renderListHeader()}
          <Block flex middle>
            {noDataComponent()}
            <Divider />
            <Button
              onPress={onLoad}
              small
              shadowless
              round
              outline
              color='info'
            >
              Reload
            </Button>
          </Block>
        </>
      )
    }

    return (
      <Block flex middle>
        {noDataComponent()}
        <Divider />
        <Button
          onPress={onLoad}
          small
          shadowless
          round
          outline
          color='info'
        >
          Reload
        </Button>
      </Block>
    )
  }

  if (check.string(items)) {
    return (
      <Text
        style={{ ...human.caption1, color: iOSColors.gray, marginTop: 5 }}
      >
        {items}
      </Text>
    )
  }

  return (
    <Block flex style={styles.group}>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <Item data={item} index={index} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
      />
    </Block>
  )
}

const styles = StyleSheet.create({
  group: {
  },
  title: {
    paddingBottom: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE * 2,
    marginTop: 22,
    color: argonTheme.COLORS.HEADER
  },
  card: {
    backgroundColor: theme.COLORS.WHITE,
    borderWidth: 0,
    height: 100,
    marginHorizontal: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE / 2,
    overflow: 'hidden',
    paddingVertical: 0,
    ...elevationShadowStyle({ elevation: 6 })
  },
  firstCard: {
    marginTop: theme.SIZES.BASE
  },
  lastCard: {
    marginBottom: theme.SIZES.BASE * 8
  },
  status: {
    backgroundColor: theme.COLORS.WHITE,
    borderWidth: 0,
    height: 100,
    // marginVertical: theme.SIZES.BASE / 2,
    width: 80
  },
  content: {
    marginHorizontal: theme.SIZES.BASE
  },
  tag: {
    ...human.caption2,
    backgroundColor: iOSColors.customGray,
    borderRadius: 10,
    fontSize: 9,
    paddingVertical: 1,
    paddingHorizontal: 10,
    marginBottom:14,
    textAlign: 'center'
  },
  disclosure: {
    width: 20
  },
  chevron: {
    position: 'relative',
    left: -10
  }
})

export default Listing
