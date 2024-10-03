import React, { useEffect, useState } from 'react'
import { ScrollView, Text, Image, FlatList, Linking, Platform, StyleSheet } from 'react-native'
import { Block, Button, theme as galioTheme } from 'galio-framework'
import { Overlay } from 'react-native-elements'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import { useStoreActions } from 'easy-peasy'
import check from 'check-types'
import moment from 'moment'

import { Navbar, Divider, Icon, DetailsLineItem } from '../../Components/Stateless'
import { ApiService } from '../../Store'
import viewStyles from '../../Styles/ViewStyles'
import { statusColor, confirmText, STATUS_TEXTS, STATUS, ACTION_STATUS } from '../../Utils/Visitor'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import { GENERAL_DAY_DISPLAY_FORMAT } from '../../Constants'
import colors from '../../Themes/Colors'

const TIME_FORMAT = 'HH:mm'

const Status = ({ status }) => {
  const _status = check.not.assigned(status) || status === 0 ? STATUS_TEXTS[0] : STATUS_TEXTS[Number(status) - 1]

  return (
    <Block style={{ borderColor: statusColor(status), borderWidth: 1, borderRadius: 3, marginTop: 10, paddingHorizontal: 10, paddingVertical: 3 }}>
      <Text style={{ ...human.caption2White, color: statusColor(status), ...systemWeights.bold, textTransform: 'uppercase', textAlign: 'center' }}>
        {_status}
      </Text>
    </Block>
  )
}

const VisitorInterface = {
  flatId: null,
  visitorId: null,
  visitorsCount: null,
  visitorName: null,
  mobile: null,
  description: null,
  image: null,
  entryDateTime: null,
  exitDateTime: null,
  status: null,
  actionStatus: null
}

const dial = (phoneNumber) => {
  let url = ''
  if (Platform.OS === 'android') {
    url = `tel:${phoneNumber}`
  } else {
    url = `telprompt:${phoneNumber}`
  }

  Linking.openURL(url)
}

const VisitorScreen = ({ navigation }) => {
  const { item } = navigation.state.params
  const loadList = useStoreActions(actions => actions.visitors.load)
  const [data, setData] = useState(VisitorInterface)
  const [status, setStatus] = useState(STATUS.REQUESTPENDING.value)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [isConfirmModalVisible, setConfirmModalVisibility] = useState(false)

  const { visitorName, visitorsCount, image, mobile, exitDateTime, actionStatus } = data

  const _setData = (data) => {
    const { description, entryDateTime, exitDateTime, status } = data

    setData(data)
    setStatus(check.assigned(status) ? status : STATUS.REQUESTPENDING.value)
    setItems([
      {
        label: 'Purpose of Visit',
        value: description,
        display: true
      },
      {
        label: 'Entry Time',
        value: check.not.assigned(entryDateTime) ? '-' : moment(entryDateTime).format(GENERAL_DAY_DISPLAY_FORMAT + ', ' + TIME_FORMAT),
        display: true
      },
      {
        label: 'Exit Time',
        value: check.not.assigned(exitDateTime) ? '-' : moment(exitDateTime).format(GENERAL_DAY_DISPLAY_FORMAT + ', ' + TIME_FORMAT),
        display: true
      }
    ])
  }

  const onUpdate = ({ status }) => {
    setSelectedStatus(status)
    setConfirmModalVisibility(true)
  }

  const onConfirmUpdate = () => {
    setIsLoading(true)
    setConfirmModalVisibility(false)

    async function update () {
      const response = await ApiService.updateVisitorItemData({
        ...data,
        status: selectedStatus
      })

      if (response.ok) {
        _setData(response.data)
        loadList({ startDate: null, endDate: null })
      }
      setIsLoading(false)
    }

    update()
  }

  const renderActionButtons = () => {
    if (check.assigned(exitDateTime)) {
      return <></>
    }
    const isDisabled = actionStatus === ACTION_STATUS.INACTIVE.value

    return (
      <Block row>
        <Block center>
          <Button
            round
            color={isDisabled ? iOSColors.midGray : 'success'}
            onPress={() => onUpdate({ status: STATUS.ALLOWED.value })}
            disabled={isDisabled}
            style={styles.changeStatusButton}
          >
            <Icon name={STATUS.ALLOWED.icon} origin={STATUS.ALLOWED.iconType} color={iOSColors.white} />
          </Button>
          <Divider small />
          <Text style={{ ...human.caption2 }}>{STATUS.ALLOWED.actionLabel}</Text>
        </Block>
        <Divider vertical />
        <Block center>
          <Button
            round
            color={isDisabled ? iOSColors.midGray : 'error'}
            onPress={() => onUpdate({ status: STATUS.BLOCKED.value })}
            disabled={isDisabled}
            style={styles.changeStatusButton}
          >
            <Icon name={STATUS.BLOCKED.icon} origin={STATUS.BLOCKED.iconType} color={iOSColors.white} />
          </Button>
          <Divider small />
          <Text style={{ ...human.caption2 }}>{STATUS.BLOCKED.actionLabel}</Text>
        </Block>
      </Block>
    )
  }

  useEffect(() => {
    setIsLoading(true)

    async function load () {
      const response = await ApiService.fetchVisitorItemData(item)

      if (response.ok) {
        _setData(response.data)
      }
      setIsLoading(false)
    }

    load()
  }, [])

  // if (isLoading) {
  //   return <ActivityIndicator />
  // }

  return (
    <Block style={viewStyles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Block flex space='between'>
          <Block>
            {/* <LinearGradient colors={statusColors(status)} style={styles.bg} /> */}
            {/* <Block flex center middle style={styles.overlay}>
                <Text style={{ ...human.title3White, ...systemWeights.light }}>
                  {statusText()}
                </Text>
              </Block>
            </LinearGradient> */}
            <Block flex row>
              <Block middle style={styles.avatarContainer}>
                <Icon name='account-clock-outline' size={96} color={iOSColors.lightGray} style={styles.defaultAvatar} />
                <Image
                  source={{ uri: image }}
                  style={styles.avatar}
                />
              </Block>
              <Block middle style={{ marginHorizontal: 15 }}>
                <Block>
                  <Text style={{ ...human.title3, ...systemWeights.bold }}>
                    {visitorName}
                    {
                      visitorsCount - 1 > 0 && (
                        <Text style={{ ...human.body, color: iOSColors.gray }}>
                          {` +${visitorsCount - 1}`}
                        </Text>
                      )
                    }
                  </Text>
                  <Block left>
                    <Status status={status} />
                  </Block>
                </Block>
              </Block>
            </Block>
            <Divider />
            <Block flex row middle space='between'>
              <DetailsLineItem label='Contact Number' value={mobile} />
              <Button onPress={() => dial(mobile)} color='transparent' style={{ width: 40, height: 40 }}>
                <Icon name='phone' size={30} color={iOSColors.gray} />
              </Button>
            </Block>
            <FlatList
              data={items}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => <DetailsLineItem {...item} />}
            />
          </Block>
          <Block center>
            <Divider />
            {renderActionButtons()}
          </Block>
        </Block>
      </ScrollView>
      <Overlay
        isVisible={isConfirmModalVisible}
        overlayStyle={{ ...styles.overlay, ...elevationShadowStyle({ elevation: 20 }) }}
      >
        <Block flex space='between'>
          <Block middle style={styles.overlayContent}>
            <Text style={{ ...human.footnote, textAlign: 'center' }}>
              {confirmText(selectedStatus)}
            </Text>
          </Block>
          <Block row space='around'>
            <Button onPress={onConfirmUpdate} color={iOSColors.black} style={styles.overlayButton}>
              <Text style={{ ...human.caption1White }}>Yes</Text>
            </Button>
            <Button onPress={() => setConfirmModalVisibility(false)} color={iOSColors.customGray} style={styles.overlayButton}>
              <Text style={{ ...human.caption1 }}>Not Now</Text>
            </Button>
          </Block>
        </Block>
      </Overlay>
    </Block>
  )
}

VisitorScreen.navigationOptions = ({ navigation, screenProps }) => {
  const { navbarTitle } = navigation.state.params

  return {
    header: (
      <Navbar
        title={navbarTitle}
        onPressBack={() => navigation.goBack(null)}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: galioTheme.SIZES.BASE
  },
  changeStatusButton: {
    height: 60,
    width: 60
  },
  firstChangeStatusButton: {
    borderTopLeftRadius: 0
  },
  avatarContainer: {
    backgroundColor: colors.white,
    width: 124,
    height: 124,
    borderRadius: 6,
    borderWidth: 0,
    ...elevationShadowStyle({ elevation: 3 })
  },
  defaultAvatar: {
    position: 'absolute',
    zIndex: 1
  },
  avatar: {
    position: 'relative',
    height: 124,
    borderRadius: 6,
    borderWidth: 0,
    width: 124,
    zIndex: 2
  },
  overlay: {
    borderRadius: 10,
    height: 125,
    overflow: 'hidden',
    padding: 0,
    width: 240
  },
  overlayContent: {
    marginTop: 20
  },
  overlayButton: {
    borderRadius: 0,
    width: 120
  }
})

export default VisitorScreen
