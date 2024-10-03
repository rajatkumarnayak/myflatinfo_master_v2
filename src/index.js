// /**
//  * React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */
// // import _ from "lodash";
// // global._ = _;

// import React from 'react'
// import OneSignal from 'react-native-onesignal'

// import Root from './App'
// import NavigationService, { navigationDeferred } from './Navigation'
// import { appReadyDeferred } from './Store/Models/Login'
// import { AsyncStorage } from 'react-native';
// import saveValue  from '../src/Services/AsyncStorage'

// const ONESIGNAL_APPID = 'aae1a31a-23da-4446-8e5d-b9c73afcacda'

// console.disableYellowBox = true
// // USING CLASS COMPONENT AS A WORKAROUND FOR HOT RELOADING
// export default class App extends React.Component {
//   constructor (properties) {
//     console.log('calling the con >>>>');
//     super(properties)
//     // OneSignal.setLogLevel(OneSignal.LOG_LEVEL.DEBUG, OneSignal.LOG_LEVEL.DEBUG)
//     OneSignal.init(ONESIGNAL_APPID, { kOSSettingsKeyAutoPrompt: true })

//     OneSignal.addEventListener('received', this.onReceived)
//     OneSignal.addEventListener('opened', this.onOpened)
//     OneSignal.addEventListener('ids', this.onIds)
//     console.log('calling at after ');
//   }

//   componentWillUnmount () {
//     OneSignal.removeEventListener('received', this.onReceived)
//     OneSignal.removeEventListener('opened', this.onOpened)
//     OneSignal.removeEventListener('ids', this.onIds)
//   }

//   onReceived (notification) {
//      console.tron.log('Notification received: ', notification)
//   }

//   onOpened (openResult) {
//     console.log('calling at open >>>>');
//     const { id, flatId, navigateTo } = openResult.notification.payload.additionalData
//     console.log(id, flatId , navigateTo, "params >>>>");
//     // console.tron.log('Message: ', openResult.notification.payload.body)
//     // console.tron.log('Data: ', openResult.notification.payload.additionalData)
//     // console.tron.log('isActive: ', openResult.notification.isAppInFocus)
//     // console.tron.log('openResult: ', openResult)

//     navigationDeferred
//       .promise
//       .then(() => {
//         console.log('caalling at mean >>>>');
//         appReadyDeferred
//           .promise
//           .then(() => {
//             console.log('caalling at mean then>>>>');
//             // if (navigateTo) {
//             //   console.log(navigateTo,'caalling at mean navigateTo >>>>');
//               if (id) {
//                 console.log(id ,'passing id >>>>>>>>>>')
//                 NavigationService.navigate("Classified")
//               } else {
//                 NavigationService.navigate(navigateTo)
//               }
//             // }else{
//             //   console.log('else >>>>>')
//             // }
//           })
//       })
//   }

//   async onIds (device) {
//     console.log('Device info: ', device)
//     const res = await saveValue('DeveiceInfo',device.pushToken)
//     console.log(res ,"res >>devcice ");
//   }


//   render () {
//     return <Root />
//   }
// }



/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
// import _ from "lodash";
// global._ = _;

import React from 'react'
import OneSignal from 'react-native-onesignal'

import Root from './App'
import NavigationService, { navigationDeferred } from './Navigation'
import { appReadyDeferred } from './Store/Models/Login'

const ONESIGNAL_APPID = 'aae1a31a-23da-4446-8e5d-b9c73afcacda'

console.disableYellowBox = true
// USING CLASS COMPONENT AS A WORKAROUND FOR HOT RELOADING
export default class App extends React.Component {
  constructor (properties) {
    super(properties)
    // OneSignal.setLogLevel(OneSignal.LOG_LEVEL.DEBUG, OneSignal.LOG_LEVEL.DEBUG)
    OneSignal.init(ONESIGNAL_APPID, { kOSSettingsKeyAutoPrompt: true })

    OneSignal.addEventListener('received', this.onReceived)
    OneSignal.addEventListener('opened', this.onOpened)
    OneSignal.addEventListener('ids', this.onIds)
  }

  componentWillUnmount () {
    OneSignal.removeEventListener('received', this.onReceived)
    OneSignal.removeEventListener('opened', this.onOpened)
    OneSignal.removeEventListener('ids', this.onIds)
  }

  onReceived (notification) {
    // console.tron.log('Notification received: ', notification)
  }

  onOpened (openResult) {
    // console.log(openResult ,"openResult >>>>>>");
    const { id, flatId, navigateTo } = openResult.notification.payload.additionalData
    console.log( id, flatId, navigateTo," id, flatId, navigateTo >>>>>>");
    // console.tron.log('Message: ', openResult.notification.payload.body)
    // console.tron.log('Data: ', openResult.notification.payload.additionalData)
    // console.tron.log('isActive: ', openResult.notification.isAppInFocus)
    // console.tron.log('openResult: ', openResult)

    navigationDeferred
      .promise
      .then(() => {
        appReadyDeferred
          .promise
          .then(() => {
            if (navigateTo) {
              console.log(navigateTo,"navigateTo >>>>");
              if (id) {
                NavigationService.navigate(navigateTo, { item: { id, flatId } })
              } else {
                NavigationService.navigate(navigateTo)
              }
            }
          })
      })
  }

  onIds (device) {
    console.log('Device info: ', device)
  }

  render () {
    return <Root />
  }
}

