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

import { Button, Divider, Loader } from '.'
import { Icon, ICON_TYPE } from '../../Icons'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import { STATUS } from '../../Constants'
import argonTheme from '../../Themes/configs/argonTheme'
import viewStyles from '../../Styles/ViewStyles'
import colors from '../../Themes/Colors'

// const { width } = Dimensions.get('screen')
// const thumbMeasure = (width - 48 - 32) / 3
// const cardWidth = width - theme.SIZES.BASE * 2
const Status = ({ status }) => {
  if (check.not.assigned(status)) {
    return <></>
  }

  let icon = 'issue-opened'
  let color = iOSColors.red

  if (status === 2) {
    icon = 'issue-closed'
    color = iOSColors.green
  } else if (status === 3) {
    color = iOSColors.blue
  } else if (status === 4) {
    icon = 'issue-reopened'
    color = iOSColors.orange
  }

  return (
    <Block
      middle
      style={{
        ...styles.status,
        backgroundColor: color
      }}
    >
      <Icon
        name={icon}
        size={40}
        origin={ICON_TYPE.OCTICONS}
        color={iOSColors.white}
      />
    </Block>
  )
}

const Tag = ({ id, text }) => {
  if (check.not.assigned(id)) {
    return <></>
  }

  let color = colors.blue100

  if (id === 2) {
    color = colors.orange100
  } else if (id === 1) {
    color = colors.red100
  }

  return (
    <Text style={{ ...styles.tag, backgroundColor: color }}>{text || 'Low'}</Text>
  )
}

const IssuesListing = ({
  items,
  onLoad,
  onRefresh,
  onPressItem,
  statusComponent,
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
    const { title, subtitle, priorityId, priority, status, date } = data
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
                : <Status status={status} />
            }
            <Block flex row center space='between'>
              <Block space='between' style={styles.content}>
                <Block>
                  <Text
                    numberOfLines={1}
                    style={{ ...human.subhead, ...systemWeights.bold }}
                  >
                    {title}
                  </Text>
                  <Block row middle space='between'>
                    <Text
                      numberOfLines={1}
                      style={{ ...human.caption2, color: iOSColors.gray }}
                    >
                      {subtitle}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{ ...human.caption2, color: iOSColors.gray }}
                    >
                      {date}
                    </Text>
                  </Block>
                </Block>
                <Divider small />
                <Block row middle space='between'>
                  <Tag id={priorityId} text={priority} />
                </Block>
                {/* <Text
                  numberOfLines={2}
                  style={{ ...human.caption2, color: iOSColors.gray, marginTop: 5 }}
                >
                  {subtitle}
                </Text> */}
              </Block>
            </Block>
            {
              check.assigned(onPressItem) && (
                <Block middle style={styles.disclosure}>
                  <Icon name='chevron-right' size={20} color={iOSColors.midGray} style={styles.chevron} />
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
    // height: '100%',
    marginHorizontal: theme.SIZES.BASE
  },
  tag: {
    ...human.caption2,
    fontSize: 9,
    backgroundColor: iOSColors.customGray,
    borderRadius: 10,
    marginTop: 5,
    paddingVertical: 2,
    paddingHorizontal: 12,
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

export default IssuesListing
