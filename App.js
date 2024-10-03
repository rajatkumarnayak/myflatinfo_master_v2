import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { GalioProvider } from 'galio-framework'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StoreProvider } from 'easy-peasy'
import SplashScreen from 'react-native-splash-screen'

import NavigationService, { isMountedRef } from './src/Navigation'
import createStore from './src/Store'
import NavigationContainer from './src/Navigation/AppNavigation'

import argonTheme from './src/Themes/configs/argonTheme'
import useTheme from './src/Themes/Context'
import useTranslation from './src/i18n'

// create the easy store
const store = createStore()

export default function App() {
  // return (
  //   <View style={styles.container}>
  //     <Text>Open up App.js to start working on bamr app!</Text>
  //     <StatusBar style="auto" />
  //   </View>
  // );

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

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

















// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start rajat on my app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
