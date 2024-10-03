import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { Text, StyleSheet } from 'react-native'
import { Block, Button } from 'galio-framework'
import { Overlay } from 'react-native-elements'
import { human, iOSColors } from 'react-native-typography'
import check from 'check-types'

import elevationShadowStyle from '../../Utils/ShadowStyle'
import Divider from './Divider'

function Confirm ({
  text,
  confirmText,
  cancelText,
  showCancelButton,
  onCancel,
  onConfirm,
  children
}, ref) {
  const [isVisible, setVisibility] = useState(false)

  const panelRef = useRef()

  const _hide = () => {
    setVisibility(false)
  }

  const _onConfirm = () => {
    _hide()
    if (check.assigned(onConfirm)) {
      onConfirm()
    }
  }

  const _onCancel = () => {
    _hide()
    if (check.assigned(onCancel)) {
      onCancel()
    }
  }

  const renderCancelButton = () => {
    if (check.not.assigned(showCancelButton) || showCancelButton) {
      return (
        <Button onPress={_onCancel} color={iOSColors.customGray} style={styles.overlayButton}>
          <Text style={{ ...human.caption1 }}>{cancelText || 'Cancel'}</Text>
        </Button>
      )
    }

    return <></>
  }

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisibility(true)
    },
    hide: () => {
      _hide()
    }
  }))

  return (
    <Overlay
      isVisible={isVisible}
      overlayStyle={styles.overlay}
    >
      <>
        <Block middle style={styles.overlayContent}>
          <Text style={{ ...human.footnote, textAlign: 'center' }}>
            {text}
          </Text>
        </Block>
        <Divider />
        <Block flex row style={styles.buttonContainer}>
          {renderCancelButton()}
          <Button onPress={_onConfirm} color={iOSColors.black} style={styles.overlayButton}>
            <Text style={{ ...human.caption1White }}>{confirmText || 'OK'}</Text>
          </Button>
        </Block>
      </>
    </Overlay>
  )
}

const styles = StyleSheet.create({
  overlay: {
    borderRadius: 10,
    height: 165,
    overflow: 'hidden',
    width: 240,
    ...elevationShadowStyle({ elevation: 20 })
  },
  overlayContent: {
    marginTop: 20
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  overlayButton: {
    borderRadius: 0,
    flex: 1
  }
})

export default forwardRef(Confirm)
