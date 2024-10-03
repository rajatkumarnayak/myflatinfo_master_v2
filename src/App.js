import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'
import { GalioProvider } from 'galio-framework'
import { SafeAreaProvider } from 'react-native-safe-area-context'
// https://github.com/react-native-component/react-native-smart-splash-screen
import SplashScreen from 'react-native-splash-screen'
import { StoreProvider } from 'easy-peasy'

import { APP_PREFIX } from './Config/index'

import NavigationService, { isMountedRef } from './Navigation'
import createStore from './Store'
import NavigationContainer from './Navigation/AppNavigation'

import { ThemeProvider } from './Themes/Context/ThemeContext'
import { AppContextProvider } from './Services/Auth/AppContext'
import { DeviceInfoProvider } from './Lib/DeviceInfo/Context'
import { LocaleContextProvider } from './i18n/LocaleContext'
import { NetInfoProvider } from './Lib/NetInfo/Context'

import argonTheme from './Themes/configs/argonTheme'
import useTheme from './Themes/Context'
import useTranslation from './i18n'
// create the easy store
const store = createStore()

// return root component
export default () => {
  console.log('calling app.js >>>>>>')
  useEffect(() => {
    SplashScreen.hide()
    isMountedRef.current = true

    return () => (isMountedRef.current = false)
  }, [])

  return (
    <SafeAreaProvider>
      <GalioProvider theme={argonTheme}>
        <DeviceInfoProvider>
          <NetInfoProvider>
            <LocaleContextProvider>
              <StoreProvider store={store}>
                <StatusBar translucent />
                <ThemeProvider>
                  <ThemeConsumer />
                </ThemeProvider>
              </StoreProvider>
            </LocaleContextProvider>
          </NetInfoProvider>
        </DeviceInfoProvider>
      </GalioProvider>
    </SafeAreaProvider>
  )
}

const ThemeConsumer = props => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <AppContextProvider>
      <NavigationContainer
        uriPrefix={APP_PREFIX}
        screenProps={{ theme, t }}
        ref={ref => NavigationService.setTopLevelNavigator(ref)}
      />
    </AppContextProvider>
  )
}
