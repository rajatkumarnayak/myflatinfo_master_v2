import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Input, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'

import elevationShadowStyle from '../../Utils/ShadowStyle'

const SearchControl = ({ text, placeholder, onPressSearch }) => {
  const [_text, setText] = useState('')

  useEffect(() => {
    setText(text || '')
  }, [text])

  return (
    <View styleName='horizontal' style={{ ...styles.container, ...elevationShadowStyle({ elevation: 2 }) }}>
      <View style={{ width: '85%' }}>
        <Input
          value={_text}
          onChangeText={inputText => setText(inputText)}
          inputStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
          placeholder={placeholder}
          numberOfLines={1}
        />
      </View>
      <View style={{ width: '15%' }}>
        <Button
          icon={<Icon name='ios-search' size={25} />}
          onPress={() => onPressSearch(_text)}
          buttonStyle={styles.button}
          disabled={_text.length < 3}
          disabledStyle={styles.buttonDisabled}
        />
      </View>
    </View>
  )
}

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    alignContent: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    position: 'relative'
  },
  inputContainer: {
    borderColor: 'transparent'
  },
  input: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20
  },
  button: {
    backgroundColor: 'transparent',
    width: 50,
    zIndex: 1
  },
  buttonDisabled: {
    backgroundColor: 'transparent',
    opacity: 0.6
  }
}

export default SearchControl
