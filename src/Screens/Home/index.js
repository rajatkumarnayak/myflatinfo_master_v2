import React,{useEffect} from 'react'
import { Dimensions, ScrollView, Text, StatusBar } from 'react-native'
import { Block, theme } from 'galio-framework'
import { human, systemWeights, iOSColors, material } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import { useStoreState } from 'easy-peasy'
import moment from 'moment'

import { Divider } from '../../Components/Stateless'
import { Flats, Noticeboard } from '../../Components/Stateful'
import colors from '../../Themes/Colors'
import viewStyles from '../../Styles/ViewStyles'

const { width, height } = Dimensions.get('screen')
const thumbMeasure = (width - 48 - 32) / 3

const HomeScreen = ({ navigation }) => {
  const userFullName = useStoreState(state => state.login.name)
  const building = useStoreState(state => state.app.building)

  const greet = () => {
    const currentTime = moment().format('H')
    let _greet = 'Good morning'

    if (currentTime > 12) {
      _greet = 'Good afternoon'
    }

    if (currentTime > 18) {
      _greet = 'Good evening'
    }

    return `${_greet}, ${userFullName}`
  }

  const renderMainContent = () => {
    return (
      <>
        <Divider />
        <Text style={{ ...human.body, color: iOSColors.gray }}>Welcome to</Text>
        {/* <Text style={styles.overlayTitle}>{building.name}</Text> */}
        <Text style={{ ...material.display1, color: iOSColors.black }} numberOfLines={1}>{building.title}</Text>
        <Divider />
        <Divider />
        <Text style={{ ...human.subhead, ...systemWeights.semibold }}>Registered Flats</Text>
        <Divider />
        <Flats />
        <Divider />
        <Divider />
        {/* <Text style={{ ...human.subhead, ...systemWeights.semibold }}>Noticeboard</Text>
        <Divider /> */}
        <Block style={{ margin: -theme.SIZES.BASE }}>
          <Noticeboard />
        </Block>
        {/* <Text style={{ ...human.subhead, ...systemWeights.semibold }}>{`Income vs Expenditure for ${building.name}`}</Text> */}
        {/* <Divider /> */}
        {/* <Chart /> */}
      </>
    )
  }

  return (
    <Block>
      <StatusBar backgroundColor='transparent' barStyle='dark-content' />
      <ScrollView>
        <Block flex style={styles.profile}>
          <Block flex>
            <Block
              style={{ ...styles.profileContainer }}
            >
              <LinearGradient colors={[iOSColors.blue, iOSColors.green]} style={styles.headerBg}>
                <Block flex style={styles.headerFg}>
                  <Text style={{ ...human.title2White, ...systemWeights.bold, textAlign: 'left' }}>{greet()}</Text>
                </Block>
              </LinearGradient>
              <Block flex style={styles.profileCard}>
                <Block>
                  {renderMainContent()}
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      </ScrollView>
    </Block>
  )
}

HomeScreen.navigationOptions = ({ navigation, screenProps }) => {
  // const { navbarTitle } = navigation.state.params

  return {
    header: null
  }
}

const styles = {
  container: {
    ...viewStyles.mainContainer,
    padding: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 2
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  headerBg: {
    height: 120
  },
  headerFg: {
    justifyContent: 'center',
    marginLeft: theme.SIZES.BASE
  },
  profile: {
    marginTop: 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  profileContainer: {
    backgroundColor: colors.grey100,
    height: height,
    padding: 0,
    width: width,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    backgroundColor: colors.grey100,
    height: '100%',
    // position: "relative",
    padding: theme.SIZES.BASE,
    // marginHorizontal: theme.SIZES.BASE,
    marginTop: -30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  divider: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#E9ECEF'
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure
  },
  chart: {
    height: 200,
    width: width * 0.9
  }
}

export default HomeScreen
