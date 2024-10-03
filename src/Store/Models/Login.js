// import {showMessage, hideMessage} from 'react-native-flash-message';
import { action, thunk } from 'easy-peasy'
import OneSignal from 'react-native-onesignal'
import check from 'check-types'

import { ApiService, StoreService } from '../../Store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  setLoginCredentials,
  getLoginCredentials,
  resetLoginCredentials
} from '../../Services/Keychain'
import { STATUS, APP_STATE } from '../../Constants'
import { showErrorToast, showLoading } from '../../Lib/Toast'
import { Deferred } from '../../Utils/Deferred'

import BaseModel from './Base'
// import DeviceInfo from 'react-native-device-info'
// import setAuthUser from '../../../src/Services/AsyncStorage'

/**
 * Wait for navigator ref to be available for handling navigations from push notification
 * https://github.com/react-navigation/react-navigation/issues/742
 */
export const appReadyDeferred = new Deferred()

const initialState = {
  appstate: APP_STATE.UNKNOWN,
  contactNumber: null,
  email: null,
  id: null,
  name: null,
  isUserLoggedIn: false,
  error: false,
  deviceid:''
}

const checkLogin = thunk(async (actions, payload, { dispatch, injections }) => {
  const credentials = await getLoginCredentials()
  console.log(credentials ,"credentials >>>>>");
  if (credentials) {
    // api.setAuthorizationHeader(credentials.access_token);
    const { username, password } = credentials
    const building = StoreService.getState().app.building
    if (check.assigned(building?.id)) {
      actions.loginUser({ phoneNumber: username, password, building })
    }
    // actions.changeAppState(APP_STATE.PRIVATE)
  } else {
    actions.changeAppState(APP_STATE.PUBLIC)
  }
})


const loginUser = thunk(async (actions, payload, { dispatch }) => {
  actions.updateStatus(STATUS.FETCHING)
  const response = await ApiService.loginUser(payload)
  console.log(response.data ,"login res >>>");
  console.log(response,'res >>>>> at login');
   

  if (!response.ok) {
    showErrorToast('Invalid Credentials')
    console.log('calling failed >> not res');
    actions.updateStatus(STATUS.FAILED)
    actions.changeAppState(APP_STATE.PUBLIC)
    appReadyDeferred.reject()
    getStatus(false)
    actions.setError()
  }
  else {
    console.log('calling fron ligonon >>')
    actions.updateStatus(STATUS.SUCCESS)
    actions.changeAppState(APP_STATE.PRIVATE)
    dispatch.app.selectBuilding(payload.building)
    dispatch.app.loadFlatList(payload.building)
    actions.setData(response.data)
    appReadyDeferred.resolve(response.data)
    getStatus(true)
    isSecurity(response.data.IsSecurity)
    setLoginCredentials(payload.phoneNumber, payload.password)
    getAsync(response.data.IsTenant ? response.data.IsTenant:false)
    OneSignal.setExternalUserId(response.data.id.toString())
  } 

  // ApiService.setAuthorizationHeader(response.data.access_token);
  // dispatch.user.requestUserProfile();
})

const getAsync = async data => {
  console.log(data, 'data sync >>');
  const set = await AsyncStorage.setItem('loginAuthUser', JSON.stringify(data));
  };

  const isSecurity =async data =>{
    console.log(data ,"is security >>>");
    const set = await AsyncStorage.setItem('securityUser', JSON.stringify(data));
  }

const getStatus = async data => {
  console.log(data, 'data sync >>');
  const set = await AsyncStorage.setItem('loginStatus', JSON.stringify(data));
  const loginStatusValue = await AsyncStorage.getItem('loginStatus');
  console.log(loginStatusValue, 'loginStatusValue >> >>>>>>>>>>> login time >>');
};



const removeAsync = async data => {
  console.log(data, 'data sync >>');
  const set = await AsyncStorage.removeItem('loginAuthUser', JSON.stringify(data));
  const securityUser = await AsyncStorage.removeItem('securityUser');
  console.log(securityUser, 'calling async securityUser');
  // const loginAuthUserData = await AsyncStorage.getItem('loginAuthUser');
  // console.log(loginAuthUserData, 'loginAuthUserData >>');
};


const logoutUser = thunk(async (actions, payload, { dispatch }) => {
  removeAsync()
  actions.changeAppState(APP_STATE.PRIVATE)
  actions.setData({ ...initialState })
  getStatus(false)
  resetLoginCredentials()
  OneSignal.removeExternalUserId()
})



const LoginModel = {
  // include BaseModel
  ...BaseModel(),
  // include all thunks or actions defined separately
  ...initialState,
  loginUser,  
  logoutUser,
  checkLogin,
  changeAppState: action((state, payload) => {
    state.appstate = payload
  }),
  setData: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key]
    }
  }),
  setError: action((state, payload) => {
    state.error = true
  }),
  onLoginInputChange: action((state, { key, value }) => {
    state[key] = value
  })
}

export default LoginModel
