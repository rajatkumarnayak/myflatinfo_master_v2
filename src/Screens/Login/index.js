import React, { useRef, useEffect, useState } from 'react'
import { Platform, Dimensions, Keyboard, TouchableOpacity, StatusBar, KeyboardAvoidingView, Image, ImageBackground, StyleSheet, Linking } from 'react-native'
import { Block, Button, Text } from 'galio-framework'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'

import hexToRgba from 'hex-to-rgba'

import { Input, Icon, Divider, Panel, AutoCompleteInput } from '../../Components/Stateless'
import { ForgotPasswordForm } from '../../Components/Stateful'
import useTheme from '../../Themes/Context'
import useAuth from '../../Services/Auth'
import showToast from '../../Lib/Toast'
import colors from '../../Themes/Colors'
import { STATUS } from '../../Constants'
import viewStyles from '../../Styles/ViewStyles'

const { width, height } = Dimensions.get('screen')

const LoginScreen = () => {
  const onChange = useStoreActions(actions => actions.login.onLoginInputChange)
  const { login } = useAuth()
  const { theme } = useTheme()
  const loadBuildingList = useStoreActions(actions => actions.app.loadBuildingList)
  const buildingList = useStoreState(state => state.app.buildingList)
  const { username, password, status } = useStoreState(state => ({
    username: state.login.username,
    password: state.login.password,
    status: state.login.status
  }))

  console.log(username,password,status ,"logindetails >>>>");
  const [_buildingList, setBuildingList] = useState(buildingList)
  const [selectedBuilding, setSelectedBuilding] = useState({ id: null, name: null })

  const inputUserName = useRef()
  const inputPassword = useRef()
  const inputBuildingName = useRef()
  const searchBuildingModalRef = useRef()
  const forgotPasswordModalRef = useRef()
  const [statusValue ,setStatusValue]=useState()

  const onSelectBuilding = (selectedBuilding) => {
    searchBuildingModalRef.current.hide()
    setSelectedBuilding(selectedBuilding)
  }

  const onSubmit = () => {
    inputPassword.current.focus()
  }

  const loginUser = () => {
    Keyboard.dismiss()

    if (check.not.assigned(selectedBuilding.id)) {
      showToast('Select a building', 'error')
      return
    }

    if (check.not.assigned(username) && check.not.assigned(password)) {
      showToast('Enter your registered phone number and password to continue', 'error')
      return
    }

    if (check.not.assigned(username)) {
      showToast('Enter your registered phone number', 'error')
      return
    }

    if (check.not.assigned(password)) {
      showToast('Enter the password', 'error')
      return
    }

    login({
      building: selectedBuilding,
      phoneNumber: username,
      password
    })
  }


  const getLoginStatus= async()=>{
     // console.log(set, 'calling async');
  const loginStatusValue = await AsyncStorage.getItem('loginStatus');
  console.log(loginStatusValue, 'loginStatusValue >> >>>>>>>>>>>');
  setStatusValue(loginStatusValue)

  }

  const loading = status === STATUS.FETCHING

  useEffect(() => {
    // console.log(theme.colors);
    getLoginStatus()
    loadBuildingList()
    // getLoginStatus()
  }, [])

  useEffect(() => {
    // console.log(theme.colors);
    if (check.nonEmptyArray(buildingList)) {
      setBuildingList(buildingList.map(({ id, name, address }) => ({
        id,
        title: name,
        subtitle: address,
        icon: 'home-city-outline'
      })))
    }
  }, [buildingList])

  // useEffect(() => {
  //   if (isForgotPasswordModalVisible) {
  //     forgotPasswordModalRef.current.open()
  //   } else {
  //     forgotPasswordModalRef.current.close()
  //   }
  // }, [isForgotPasswordModalVisible])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'height' : 'height'}
      style={styles.root}
    >
      <Block flex middle>
        <StatusBar backgroundColor='transparent' />
        <ImageBackground
          source={require('../../../assets/images/login-bg-portrait.png')}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex middle>
            <Block style={styles.container}>
              <Block middle>
                <Block
                  middle
                  style={styles.logoContainer}
                >
                  <Image
                    style={styles.logoImage}
                    source={require('../../../assets/images/logo.png')}
                    resizeMode='contain'
                  />
                </Block>
              </Block>
              <Divider small />
              <Block>
                <KeyboardAvoidingView
                  behavior='padding'
                  enabled
                >
                  <TouchableOpacity onPress={() => searchBuildingModalRef.current.show()}>
                    <Input
                      ref={inputBuildingName}
                      editable={false}
                      value={selectedBuilding.title}
                      borderless
                      placeholder='Select building'
                      iconContent={
                        <Icon
                          size={16}
                          color={colors.ashgrey}
                          name='home-city-outline'
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </TouchableOpacity>
                  <Divider small />
                  <Block>
                    <Input
                      ref={inputUserName}
                      autoCapitalize='none'
                      keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
                      returnKeyType='next'
                      onSubmitEditing={onSubmit}
                      onChangeText={text =>
                        onChange({
                          key: 'username',
                          value: text
                        // value: RegExp('^[0-9]+$').test(text) ? text : username
                        })}
                      value={statusValue == "false" ? null: username}
                      borderless
                      maxLength={10}
                      placeholder='Phone Number'
                      iconContent={
                        <Icon
                          size={16}
                          color={colors.ashgrey}
                          name='phone'
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>
                  <Divider small />
                  <Block>
                    <Input
                      ref={inputPassword}
                      value={statusValue == "false" ? null :password}
                      returnKeyType='go'
                      onSubmitEditing={loginUser}
                      onChangeText={text =>
                        onChange({
                          key: 'password',
                          value: text
                        })}
                      password
                      borderless
                      placeholder='Password'
                      iconContent={
                        <Icon
                          size={16}
                          color={colors.ashgrey}
                          name='key'
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>
                  <Divider small />
                  <Block center>
                    <TouchableOpacity style={{ height: 30, justifyContent: 'center' }} onPress={() => forgotPasswordModalRef.current.show()}>
                      <Text style={{ ...human.caption1, color: iOSColors.gray }}>Forgot password?</Text>
                    </TouchableOpacity>
                  </Block>
                  <Divider small />
                  <Block center>
                    <Button
                      onPress={loginUser}
                      loading={loading}
                      size='small'
                      round
                      uppercase
                      color={theme.colors.primary}
                    >
                      <Text style={{ ...human.footnoteWhite, ...systemWeights.bold }}>
                      Sign In
                      </Text>
                    </Button>
                  </Block>
                </KeyboardAvoidingView>
              </Block>
            </Block>
            <Divider />
            <Block row style={styles.termsContainer}>
              <Text style={styles.termsText}>
              By continuing, you accept the
              </Text>
              <Divider vertical style={styles.wordSeparator} />
              <Text onPress={() => Linking.openURL('https://myflatinfo.com/terms/')} style={[styles.termsText, styles.linkText]}>
              Terms of Use
              </Text>
              <Divider vertical style={styles.wordSeparator} />
              <Text style={styles.termsText}>
              and
              </Text>
              <Divider vertical style={styles.wordSeparator} />
              <Text onPress={() => Linking.openURL('https://myflatinfo.com/privacy/')} style={[styles.termsText, styles.linkText]}>
              Privacy Policy
              </Text>
            </Block>
            <Block style={styles.copyrightContainer}>
              <Block middle>
                <Block>
                  <Text style={styles.copyrightText}>
                  Made in India
                  </Text>
                </Block>
                <Divider small />
                <Block row>
                  <Text style={styles.copyrightText}>{'\u00A9'}</Text>
                  <Divider vertical style={styles.wordSeparator} />
                  <Text style={styles.copyrightText}>{moment().format('YYYY')}</Text>
                  <Divider vertical style={styles.wordSeparator} />
                  <Text style={styles.copyrightText}>
                  Jaya Technological Solutions. All rights reserved.
                  </Text>
                </Block>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
        <Panel
          ref={searchBuildingModalRef}
          height={height / 2}
        >
        <>
          <Block row space='between' style={viewStyles.modalHeading}>
            <Text style={{ ...human.title3, ...systemWeights.bold }}>Select Building</Text>
            <TouchableOpacity onPress={() => loadBuildingList()}>
              <Text caption2 style={{ color: iOSColors.blue }}>Refresh</Text>
            </TouchableOpacity>
          </Block>
          <Divider />
          <Block style={{ height: 360 }}>
            <AutoCompleteInput
              data={_buildingList}
              didAutoComplete={(item) => onSelectBuilding(item)}
            />
          </Block>
        </>
        </Panel>
        <Panel
          ref={forgotPasswordModalRef}
          height={height / 2}
        >
          <Block style={viewStyles.modalHeading}>
            <Block row space='between'>
              <Text style={{ ...human.title3, ...systemWeights.bold }}>Forgot Password?</Text>
              <TouchableOpacity onPress={() => forgotPasswordModalRef.current.hide()}>
                <Icon
                  size={24}
                  color={colors.ashgrey}
                  name='close'
                />
              </TouchableOpacity>
            </Block>
            <Divider small />
            <Text style={{ ...human.caption1, color: iOSColors.gray }}>No worries! Send us the building name and your registered phone number or email address and we will send you a link to reset your password</Text>
          </Block>
          <Block style={viewStyles.modalContent}>
            <ForgotPasswordForm onSuccess={() => forgotPasswordModalRef.current.hide()} />
            <Divider />
            <Block center>
              <TouchableOpacity onPress={() => forgotPasswordModalRef.current.hide()}>
                <Text style={{ ...human.caption1, color: iOSColors.tealBlue }}>Nevermind</Text>
              </TouchableOpacity>
            </Block>
          </Block>
        </Panel>
      </Block>
    </KeyboardAvoidingView>

  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  logoContainer: {
    height: 100,
    width: 240
  },
  // https://medium.com/the-react-native-log/tips-for-react-native-images-or-saying-goodbye-to-trial-and-error-b2baaf0a1a4d
  logoImage: {
    alignSelf: 'stretch',
    flex: 1,
    height: undefined,
    marginHorizontal: 15,
    width: undefined
  },
  inputIcon: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    height: 45,
    position: 'absolute',
    left: 0,
    top: 0,
    width: 50,
    zIndex: 1
  },
  input: {
    borderWidth: 0, borderRadius: 5, height: 45, paddingLeft: 50, justifyContent: 'center'
  },
  container: {
    width: width > 360 ? 360 : (width - 40),
    height: 440,
    backgroundColor: hexToRgba('#F4F5F7', 0.95),
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 40,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'hidden'
  },
  // socialConnect: {
  //   backgroundColor: colors.white,
  //   borderBottomWidth: StyleSheet.hairlineWidth,
  //   borderColor: '#8898AA'
  // },
  // socialButtons: {
  //   width: 120,
  //   height: 40,
  //   backgroundColor: '#fff',
  //   shadowColor: colors.black,
  //   shadowOffset: {
  //     width: 0,
  //     height: 4
  //   },
  //   shadowRadius: 8,
  //   shadowOpacity: 0.1,
  //   elevation: 1
  // },
  // socialTextButtons: {
  //   color: colors.black,
  //   fontWeight: '800',
  //   fontSize: 14
  // },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  loginButton: {
    // width: width * 0.5
  },
  termsContainer: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 20
  },
  termsText: {
    ...human.caption1White,
    letterSpacing: 0.5
  },
  linkText: {
    textDecorationLine: 'underline'
  },
  wordSeparator: {
    width: 2.5
  },
  copyrightContainer: {
    justifyContent: 'center',
    marginBottom: 20,
    padding: 20,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  copyrightText: {
    ...human.caption2White,
    opacity: 0.7
  }

})

export default LoginScreen
