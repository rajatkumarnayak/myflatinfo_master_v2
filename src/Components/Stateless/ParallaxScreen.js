import React, { useRef, useEffect } from 'react'
import {
  Platform,
  StyleSheet,
  Animated,
  View,
  ScrollView,
  Image,
  ImageBackground,
  ActivityIndicator
} from 'react-native'
import PropTypes from 'prop-types'
// import SafeAreaView from 'react-native-safe-area-view'
import ParallaxScroll from '@monterosa/react-native-parallax-scroll'
// import FlashMessage from 'react-native-flash-message';
import * as Animatable from 'react-native-animatable'
import check from 'check-types'
import hexToRgba from 'hex-to-rgba'

import viewStyles from '../../Styles/ViewStyles'
import useTheme from '../../Themes/Context'
// import useDeviceInfoContext from '../../Lib/DeviceInfo'

const ParallaxScreen = props => {
  const { theme } = useTheme()
  // const deviceInfo = useDeviceInfoContext()
  const navbarHeight =
    Platform.OS === 'android' ? 120 : 100

  const fixedHeaderContentContainer = useRef(null)

  const {
    children,
    containerStyle,
    backgroundImage,
    navbarBackgroundColor,
    headerHeight,
    headerBackgroundColor,
    headerImage,
    renderNavbar,
    renderHeaderContent,
    renderFixedHeaderContent,
    fixedHeaderContentContainerStyle,
    renderFloatingActionButton,
    refreshControl,
    isLoading
  } = props

  const renderParallaxBackground = () => {
    return <Image source={headerImage} style={styles.image} />
  }

  const renderParallaxForeground = () => {
    return (
      <Animated.View
        style={{
          backgroundColor: headerBackgroundColor,
          flex: 1,
          width: '100%'
        }}
      >
        {renderHeaderContent()}
      </Animated.View>
    )
  }

  const renderLoader = () => {
    if (isLoading) {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
        </View>
      )
    }

    // if (isLoading) {
    //   return (
    //     <ProgressBar
    //       color={theme.colors.primary}
    //       indeterminate
    //       borderRadius={0}
    //       borderWidth={0}
    //       height={4}
    //       width={Dimensions.get('window').width}
    //       style={styles.loader}
    //     />
    //   )
    // }
  }

  const renderFixedHeader = () => {
    if (check.assigned(renderFixedHeaderContent)) {
      return (
        <Animatable.View
          ref={fixedHeaderContentContainer}
          useNativeDriver
          style={{
            flex: 0,
            position: 'absolute',
            top: 100,
            left: 0,
            zIndex: 100,
            ...fixedHeaderContentContainerStyle
          }}
        >
          {renderFixedHeaderContent()}
        </Animatable.View>
      )
    }
  }

  const _renderFloatingActionButton = () => {
    return !renderFloatingActionButton ? <></> : renderFloatingActionButton()
  }

  const _backgroundImage = () => {
    if (backgroundImage) {
      return { uri: backgroundImage }
    } else {
      return require('../../../assets/images/bg.png')
    }
  }

  return (
    <View style={viewStyles.container}>
      {renderFixedHeader()}
      {_renderFloatingActionButton()}
      <ParallaxScroll
        headerHeight={navbarHeight}
        isHeaderFixed
        parallaxHeight={headerHeight || 180}
        parallaxBackgroundScrollSpeed={5}
        parallaxForegroundScrollSpeed={2.5}
        headerBackgroundColor={hexToRgba(navbarBackgroundColor, 0)}
        headerFixedBackgroundColor={hexToRgba(navbarBackgroundColor, 1)}
        fadeOutParallaxForeground
        renderHeader={({ animatedValue }) => renderNavbar()}
        renderParallaxBackground={({ animatedValue }) =>
          renderParallaxBackground()}
        renderParallaxForeground={({ animatedValue }) =>
          renderParallaxForeground()}
        refreshControl={refreshControl}
        keyboardShouldPersistTaps='handled'
        // onScrollEndDrag={onScrollEndSnapToEdge}
        // onMomentumScrollEnd={onScrollEndSnapToEdge}
        // onScroll={event => onScroll(event)}
      >
        <ImageBackground
          source={_backgroundImage()}
          style={styles.bgImage}
        >
          <View style={[styles.wrapperForParallax]}>
            {renderLoader()}
            {children}
          </View>
        </ImageBackground>
      </ParallaxScroll>
    </View>
  )
}

ParallaxScreen.propTypes = {
  containerStyle: PropTypes.object,
  backgroundImage: PropTypes.string,
  navbarBackgroundColor: PropTypes.string,
  headerBackgroundColor: PropTypes.string,
  headerImage: PropTypes.object,
  renderNavbar: PropTypes.func,
  renderHeaderContent: PropTypes.func,
  renderFixedHeaderContent: PropTypes.func,
  fixedHeaderContentContainerStyle: PropTypes.object,
  renderFloatingActionButton: PropTypes.func,
  refreshControl: PropTypes.object,
  isLoading: PropTypes.bool
}

const styles = StyleSheet.create({
  test: {
    borderWidth: 5,
    borderColor: 'red'
  },
  test1: {
    borderWidth: 5,
    borderColor: 'green'
  },
  wrapperForParallax: {
    flex: 1,
    zIndex: 10,
    position: 'relative',
    justifyContent: 'center'
  },
  wrapper: {
    flex: 1,
    padding: 25,
    zIndex: 10,
    position: 'relative'
  },
  bgImageContainer: {
    backgroundColor: '#fafafa'
  },
  bgImage: {
    flex: 1,
    position: 'relative',
    width: null,
    height: null,
    zIndex: 10
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1
  },
  activityIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100
  },
  // https://medium.com/the-react-native-log/tips-for-react-native-images-or-saying-goodbye-to-trial-and-error-b2baaf0a1a4d
  imageContainer: {
    flex: 1
  },
  image: {
    alignSelf: 'stretch',
    flex: 1,
    width: undefined,
    height: undefined,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
})

export default ParallaxScreen
