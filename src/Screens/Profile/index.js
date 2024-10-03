import React, { useState, useRef } from 'react'
import { ScrollView, Dimensions, Image, Text, TouchableOpacity } from 'react-native'
import { Block, Button, theme as galioTheme } from 'galio-framework'
import LinearGradient from 'react-native-linear-gradient'
import { Overlay } from 'react-native-elements'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import { useStoreState } from 'easy-peasy'

import { Navbar, Divider, DetailsLineItem, Input, Panel } from '../../Components/Stateless'
import useTheme from '../../Themes/Context'
import colors from '../../Themes/Colors'
import NavigationService from '../../Navigation'
import viewStyles from '../../Styles/ViewStyles'
import { Icon } from '../../Icons'
import { ChangePasswordForm } from '../../Components/Stateful'

const { width, height } = Dimensions.get('screen')
const thumbMeasure = (width - 48 - 32) / 3

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme()
  const building = useStoreState(state => state.app.building)
  const { name, contactNumber, email, image } = useStoreState(state => ({ ...state.login }))

  const [isChangePasswordModalVisible, setChangePasswordModalVisibility] = useState(false)

  const changePasswordModalRef = useRef()

  return (
    <>
      <ScrollView>
        <Block flex style={styles.container}>
          <Block flex>
            <Block style={styles.profileContainer}>
              <LinearGradient colors={[iOSColors.blue, iOSColors.green]} style={styles.bg} />
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ width, height: '100%' }}
              >
                <Block flex style={styles.profileCard}>
                  <Block middle style={styles.avatarContainer}>
                    <Image
                      source={{ uri: image }}
                      style={styles.avatar}
                    />
                  </Block>
                  <Block>
                    <DetailsLineItem label='Name' value={name} />
                    <DetailsLineItem label='Phone' value={contactNumber} />
                    <DetailsLineItem label='Email' value={email} />
                    <DetailsLineItem label='Building' value={building.title} />
                    <Divider large />
                    <TouchableOpacity onPress={() => changePasswordModalRef.current.show()}>
                      <Text style={{ ...human.footnote, color: iOSColors.blue }}>Change Password</Text>
                    </TouchableOpacity>
                  </Block>
                </Block>
              </ScrollView>
            </Block>
          </Block>
        </Block>
      </ScrollView>
      <Panel
        ref={changePasswordModalRef}
        height={500}
      >
        <Block>
          <Block row space='between' style={viewStyles.modalContent}>
            <Text style={{ ...human.title3, ...systemWeights.bold }}>Change Password</Text>
            <TouchableOpacity onPress={() => changePasswordModalRef.current.hide()}>
              <Icon
                size={24}
                color={colors.ashgrey}
                name='close'
              />
            </TouchableOpacity>
          </Block>
          <ChangePasswordForm onSuccess={() => changePasswordModalRef.current.hide()} />
        </Block>
      </Panel>
    </>
  )
}

ProfileScreen.navigationOptions = ({ navigation, screenProps }) => {
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
  bg: { height: 250, position: 'absolute', left: 0, top: 0, right: 0 },
  overlay: {
    paddingVertical: 50
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
    padding: galioTheme.SIZES.BASE,
    // marginHorizontal: theme.SIZES.BASE,
    marginTop: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
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
  }
}

export default ProfileScreen
