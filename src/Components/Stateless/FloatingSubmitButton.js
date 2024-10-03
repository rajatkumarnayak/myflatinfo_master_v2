import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import check from 'check-types'
import colors from '../../Themes/Colors'
import elevationShadowStyle from '../../Utils/ShadowStyle'

const DEFAULT_BUTTON_COLOR = colors.blue300
const DEFAULT_BUTTON_TEXT_COLOR = colors.white
const DOT_SIZE = 15

const FloatingSubmitButton = ({ text, icon, onPress, showDot, color, style }) => {
  const buttonStyle = () => {
    const elevation = elevationShadowStyle({ elevation: 20 })

    if (check.assigned(text)) {
      if (check.assigned(color)) {
        return {
          ...styles.button,
          ...styles.buttonWithText,
          ...elevation,
          backgroundColor: color
        }
      } else {
        return {
          ...styles.button,
          ...styles.buttonWithText,
          ...elevation
        }
      }
    } else {
      if (check.assigned(color)) {
        return {
          ...styles.button,
          ...elevation,
          backgroundColor: color
        }
      } else {
        return {
          ...styles.button,
          ...elevation
        }
      }
    }
  }

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={buttonStyle()}
      >
        <View style={styles.buttonContent}>
          <Icon
            name={check.assigned(icon) ? icon : 'plus'}
            size={30}
            color={DEFAULT_BUTTON_TEXT_COLOR}
          />
          {
            check.not.assigned(text)
              ? <></>
              : (
                <Text style={styles.text}>
                  {text}
                </Text>
              )
          }
          {
            showDot && <View style={styles.dot} />
          }
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
  },
  button: {
    backgroundColor: DEFAULT_BUTTON_COLOR,
    borderRadius: 50,
    position: 'absolute',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30
  },
  buttonWithText: {
    height: 45,
    width: 'auto'
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15
  },
  text: {
    ...human.body,
    ...systemWeights.bold,
    color: DEFAULT_BUTTON_TEXT_COLOR,
    marginHorizontal: 10
  },
  dot: {
    backgroundColor: iOSColors.red,
    borderWidth: 2,
    borderColor: iOSColors.white,
    borderRadius: DOT_SIZE,
    height: DOT_SIZE,
    position: 'absolute',
    top: -DOT_SIZE,
    right: 0,
    width: DOT_SIZE
  }
})

export default FloatingSubmitButton
