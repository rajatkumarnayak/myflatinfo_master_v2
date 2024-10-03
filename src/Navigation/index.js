import * as React from 'react'
import { NavigationActions, StackActions } from '@react-navigation/native'
import { DrawerActions } from '@react-navigation/drawer'

import Routes from './Routes'
import { Deferred } from '../Utils/Deferred'

export { Routes }

/**
 * Navigating without the navigation prop
 * https://reactnavigation.org/docs/navigating-without-navigation-prop/
 */

export const isMountedRef = React.createRef()
export const navigationRef = React.createRef()

/**
 * Wait for navigator ref to be available for handling navigations from push notification
 * https://github.com/react-navigation/react-navigation/issues/742
 */
export const navigationDeferred = new Deferred()

/**
 * This function is called when the RootScreen is created to set the navigator instance to use.
 */
function setTopLevelNavigator (ref) {
  console.log('calling at navigation services')
  // navigator = ref
  navigationRef.current = ref
  navigationDeferred.resolve(ref)
}

/**
 * Function to navigate to the last route.
 *
 */
function goBack () {
  // console.log("LOG_navigate", routeName, params);
  navigationRef.current.dispatch(NavigationActions.back())
}

/**
 * Call this function when you want to navigate to a specific route.
 *
 * @param routeName The name of the route to navigate to. Routes are defined in RootScreen using createStackNavigator()
 * @param params Route parameters.
 */
function navigate (routeName, params) {
  console.log(routeName, params, "routeName, params >>>>");
  if (isMountedRef.current && navigationRef.current) {
    console.log('calling at navigation service >>>>>>')
    navigationRef.current.dispatch(
      NavigationActions.navigate({
        routeName,
        params
      })
    )
  }
}

/**
 * Call this function when you want to navigate to a specific route AND reset the navigation history.
 *
 * That means the user cannot go back. This is useful for example to redirect from a splashscreen to
 * the main screen: the user should not be able to go back to the splashscreen.
 *
 * @param routeName The name of the route to navigate to. Routes are defined in RootScreen using createStackNavigator()
 * @param params Route parameters.
 */
function navigateAndReset (routeName, params) {
  navigationRef.current.dispatch(
    StackActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          routeName,
          params
        })
      ]
    })
  )
}

function popToTop () {
  navigationRef.current.dispatch(
    StackActions.popToTop()
  )
}

function toggleDrawer () {
  navigationRef.current.dispatch(DrawerActions.toggleDrawer())
}

function openDrawer () {
  navigationRef.current.dispatch(DrawerActions.openDrawer())
}

function closeDrawer () {
  navigationRef.current.dispatch(DrawerActions.closeDrawer())
}

const NavigationService = {
  goBack,
  popToTop,
  navigate,
  toggleDrawer,
  openDrawer,
  closeDrawer,
  navigateAndReset,
  setTopLevelNavigator
}

export default NavigationService
