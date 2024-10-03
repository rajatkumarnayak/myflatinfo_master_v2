import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, KeyboardAvoidingView } from 'react-native'
import Modal from 'react-native-modal'
import { Overlay } from 'react-native-elements'
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Modalize } from 'react-native-modalize'
import check from 'check-types'

import metrics from '../../Themes/Metrics'
import viewStyles from '../../Styles/ViewStyles'
import colors from '../../Themes/Colors'
import elevationShadowStyle from '../../Utils/ShadowStyle'

const screenHeight = Dimensions.get('screen').height
// const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

const PanelHandle = () => <View style={styles.panelHandle} />

function Panel ({
  animated = true,
  panelContentHeight,
  panelBackgroundColor,
  panelStyle,
  height,
  children
}, ref) {
  const [isVisible, setVisibility] = useState(false)
  const [scrollOffset, setScrollOffset] = useState(null)

  const panelRef = useRef()
  const scrollViewRef = useRef()

  const handleOnScroll = event => {
    setScrollOffset(event.nativeEvent.contentOffset.y)
  }

  const handleScrollTo = p => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p)
    }
  }

  const _hide = () => {
    setVisibility(false)
  }

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisibility(true)
    },
    hide: () => {
      _hide()
    }
  }))

  const StaticModal = ({ children }) => {
    return (

      <Overlay
        isVisible={isVisible}
        onBackdropPress={_hide}
        windowBackgroundColor='rgba(0, 0, 0, .5)'
        overlayStyle={[styles.staticModal, { height }]}
      >
        {children}
      </Overlay>

    )
  }

  const AnimatedModal = ({ children }) => {
    return (

      <Modal
        animationType='slide'
        swipeDirection={['down']}
        hideModalContentWhileAnimating
        propagateSwipe
        backdropOpacity={0.5}
        // scrollOffset={scrollOffset}
        // scrollTo={handleScrollTo}
        // scrollOffsetMax={100}
        useNativeDriver
        isVisible={isVisible}
        swipeThreshold={100}
        onSwipeComplete={_hide}
        onBackButtonPress={_hide}
        onBackdropPress={_hide}
        style={styles.animatedModal}
        avoidKeyboard
      >
        <PanelHandle />
        <View style={[styles.panelContainer, height ? { height: height } : {}]}>

          {children}

        </View>

      </Modal>

    )
  }

  const renderContent = () => (
    <View style={[styles.panelContainer, height ? { height: height } : {}]}>
      <View style={[
        panelStyle,
        styles.panel,
        { backgroundColor: panelBackgroundColor || '#fff' }]}
      >
        {children}
      </View>
    </View>
  )

  return (
    <>

      {
        check.assigned(animated) && check.boolean(animated)
          ? <AnimatedModal>{renderContent()}</AnimatedModal>
           : <StaticModal>{renderContent()}</StaticModal>
      }

    </>
  )
}

const styles = StyleSheet.create({
  staticModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: screenHeight / 2,
    margin: 0,
    padding: 0,
    // position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    // bottom: 0,
    width: '100%',
    ...elevationShadowStyle({ elevation: 30 })
  },
  animatedModal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  panelHandle: {
    alignSelf: 'center',
    backgroundColor: '#ededed',
    borderRadius: 4,
    height: 5,
    marginVertical: 10,
    width: 50
  },
  panelContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: screenHeight / 2,
    ...elevationShadowStyle({ elevation: 30 })
  },
  panel: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  modalContainer: {
    height: Dimensions.get('window').height * 0.3,
    width: Dimensions.get('window').width,
    backgroundColor: 'red'
  }
})

export default forwardRef(Panel)
