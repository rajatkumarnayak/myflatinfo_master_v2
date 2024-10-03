import React, { useState, useEffect } from 'react'
import { ScrollView, Text, Dimensions, FlatList, Image } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import LinearGradient from 'react-native-linear-gradient'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import check from 'check-types'

import { Divider, Loader, NoData, Navbar } from '../../Components/Stateless'
import colors from '../../Themes/Colors'
import NavigationService from '../../Navigation'
import { STATUS } from '../../Constants'
import { ApiService } from '../../Store'

const { width, height } = Dimensions.get('screen')
const thumbMeasure = (width - 48 - 32) / 3

const statusColors = (status) => {
  if (status === 2) {
    return [colors.green300, colors.green600]
  }

  return [colors.red200, colors.red600]
}

const Status = ({ status, statusText }) => {
  let _statusText = ''

  if (check.assigned(statusText)) {
    _statusText = statusText
  } else {
    _statusText = status === 1 ? 'Paid' : 'Pending'
  }

  return (
    <Block middle>
      <Block row middle style={styles.status}>
        <Icon
          name={status === 2
            ? 'check-circle-outline'
            : 'alert-circle-outline'}
          size={16}
          color={status === 2
            ? iOSColors.green
            : iOSColors.red}
        />
        <Text
          style={{
            ...human.caption1,
            ...systemWeights.bold,
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginLeft: 10,
            color: status === 2
              ? iOSColors.green
              : iOSColors.red
          }}
        >
          {_statusText}
        </Text>
      </Block>
    </Block>
  )
}

const Item = ({ label, value, display }) => {
  if (!display) {
    return <></>
  }

  const _label = () => (
    <Text
      style={{ ...human.caption1, color: iOSColors.gray }}
    >
      {label}
    </Text>
  )

  const _value = () => {
    // if (isBase64(value, { allowMime: true })) {
    // return (
    //   <FileLink
    //     fileName='demo.jpg'
    //     displayName='Invoice'
    //     encoding='base64'
    //   />
    // )
    // }

    return <Text style={{ ...human.subhead, ...systemWeights.bold }}>{value}</Text>
  }

  return (
    <Block style={styles.item}>
      <Block>
        {_label()}
        <Divider small />
        {_value()}
      </Block>
    </Block>
  )
}

const IssueScreen = ({ navigation }) => {
  const { item } = navigation.state.params
  const [networkStatus, setNetworkStatus] = useState(STATUS.NOT_STARTED)
  const [data, setData] = useState(null)
  const [image, setImage] = useState(0)
  const [status, setStatus] = useState(0)
  const [items, setItems] = useState([])

  const _setData = (data) => {
    const { title, description, priority, ticketNumber, status, statusText, image } = data

    setData(data)
    setImage(image)
    setStatus(status)
    setItems([
      {
        label: 'Title',
        value: title,
        display: true
      },
      {
        label: 'Description',
        value: description,
        display: true
      },
      {
        label: 'Ticket Number',
        value: ticketNumber,
        display: true
      },
      {
        label: 'Priority',
        value: priority,
        display: true
      },
      {
        label: 'Status',
        value: statusText,
        display: true
      }
    ])
  }

  const renderHeaderContent = () => {
    if (check.assigned(image)) {
      return (
        <LinearGradient colors={statusColors(status)} style={styles.headerBg}>
          <Block style={styles.headerFg}>
            {/* <Block flex style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
            </Block> */}
          </Block>
        </LinearGradient>
      )
    }
  }

  const renderMainContent = () => {
    if (check.not.assigned(items)) {
      return <></>
    }

    return (
      <ScrollView>
        <Block flex style={styles.container}>
          {renderHeaderContent()}
          <Block flex style={[styles.panel, { marginTop: check.assigned(image) ? 80 : 0 }]}>
            <Divider small />
            <FlatList
              data={items}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => <Item {...item} />}
            />
          </Block>
        </Block>
        <Block flex style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </Block>
      </ScrollView>
    )
  }

  useEffect(() => {
    setNetworkStatus(STATUS.FETCHING)

    async function load () {
      const response = await ApiService.fetchIssueItemData(item)
      if (response.ok) {
        setNetworkStatus(STATUS.SUCCESS)
        _setData(response.data)
      } else {
        setNetworkStatus(STATUS.FAILED)
      }
    }

    load()
  }, [])

  if (networkStatus === STATUS.FETCHING) {
    return (
      <Block flex middle height={height}>
        <Loader />
      </Block>
    )
  }

  if (networkStatus === STATUS.FAILED) {
    return (
      <Block flex middle height={height}>
        <NoData text='Something went wrong' />
      </Block>
    )
  }

  return (
    <Block>
      {renderMainContent()}
    </Block>
  )
}

IssueScreen.navigationOptions = ({ navigation, screenProps }) => {
  const { navbarTitle } = navigation.state.params

  return {
    header: (
      <Navbar
        title={navbarTitle}
        onPressBack={() => NavigationService.goBack()}
      />
    )
  }
}

const styles = {
  headerBg: { height: 260, position: 'absolute', left: 0, top: 0, right: 0 },
  headerFg: {
    height: 240
  },
  imageContainer: {
  },
  image: {
    height: 260,
    resizeMode: 'contain',
    width: '100%'
  },
  status: {
    backgroundColor: colors.white,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 15
  },
  payButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 50,
    width: 120
  },
  payButtonText: {

  },
  item: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: iOSColors.customGray,
    height: 80,
    paddingHorizontal: galioTheme.SIZES.BASE
  },
  profile: {
    marginTop: 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  container: {
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  panel: {
    flex: 1,
    flexGrow: 1,
    height: '100%',
    // position: "relative",
    padding: galioTheme.SIZES.BASE,
    // marginHorizontal: theme.SIZES.BASE,
    marginTop: 240,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: galioTheme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure
  }
}

export default IssueScreen
