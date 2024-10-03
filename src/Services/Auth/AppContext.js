import React, { useEffect, useCallback, useState } from 'react'
import { Alert } from 'react-native'
import { useStoreActions, useStoreState } from 'easy-peasy'
import check from 'check-types'

import useStorage from '../../Services/AsyncStorage'
import { APP_STATE } from '../../Constants'
import { resetLoginCredentials } from '../Keychain'
import NavigationService, { Routes } from '../../Navigation'
// import useCheckVersion from '../CheckVersion';
// import useDeviceInfoContext from '../../Lib/DeviceInfo'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AppStateContext = React.createContext()

const INITIAL_STORE_BUILDING_DATA = { id: null, name: null, address: null }

export const AppContextProvider = props => {
  // Persistance
  const [appIntroState, setAppIntroState] = useStorage('@appintro', { toShowAppIntro: true })
  const [persistedBuildingData, persistBuildingData] = useStorage('@building', INITIAL_STORE_BUILDING_DATA)

  const [isSecutiry, setSecurity] = useState(false)
  // Store actions
  const { loginUser, setState, checkLogin, logoutUser } = useStoreActions(actions => ({
    loginUser: actions.login.loginUser,
    setState: actions.login.changeAppState,
    checkLogin: actions.login.checkLogin,
    logoutUser: actions.login.logoutUser
  }))
  const selectBuilding = useStoreActions(actions => actions.app.selectBuilding)
  // useCheckVersion();
  const state = useStoreState(store => store.login.appstate)

  const _hideAppIntroForever = () => {
    setAppIntroState({ toShowAppIntro: false })
  }


  const _logoutUser = useCallback(async () => {
    logoutUser()

  }, [setState])

  const logout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Yes, Logout',
          onPress: _logoutUser
        },
        {
          type: 'cancel',
          text: 'No, Stay here'
        }
      ]
    )
  }, [_logoutUser])

  const login = useCallback(params => {
    console.log(params, "params >>>>> for login >>>");
    persistBuildingData(params.building)
    loginUser(params)
  }, [loginUser])

  // check loggedin on mount
  useEffect(() => {
    console.log('clling first use Effect');
    state === APP_STATE.UNKNOWN && checkLogin()
    if (check.assigned(persistedBuildingData.id)) {
      selectBuilding(persistedBuildingData)
    }

    // getSecurtiy()

  }, [checkLogin, state, persistedBuildingData])

  // app state reactor
  useEffect(() => {
    getSecurtiy()
  }, [state, isSecutiry])


  const getSecurtiy = async () => {
    const securityUser = await AsyncStorage.getItem('securityUser');

    setSecurity(securityUser)
    if (isSecutiry == 'true') {
      console.log(isSecutiry, "securityUser >>>>> at context >> 1213")

      if (state === APP_STATE.PRIVATE) {
        NavigationService.navigate(Routes.SECURITY_SCREEN)
      } else if (state === APP_STATE.PUBLIC) {
        NavigationService.navigate(Routes.LOGIN_STACK)
      } else if (state === APP_STATE.PRIVATE && isSecutiry == false) {
        NavigationService.navigate(Routes.MAIN_APP)
      }
    } else {
      console.log(isSecutiry, "securityUser >>>>> at context >> 1213")

      if (state === APP_STATE.PRIVATE) {
        NavigationService.navigate(Routes.MAIN_APP)
      } else if (state === APP_STATE.PUBLIC) {
        NavigationService.navigate(Routes.LOGIN_STACK)
      }
    }
  }

  return (
    <AppStateContext.Provider
      value={{
        state,
        logout,
        login,
        hideAppIntroForever: _hideAppIntroForever
      }}
    >
      {props.children}
    </AppStateContext.Provider>
  )
}

export default AppStateContext






