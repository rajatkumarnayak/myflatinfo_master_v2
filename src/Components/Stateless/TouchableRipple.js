import React from 'react'
// import Ripple from 'react-native-material-ripple'
import {TouchableOpacity } from 'react-native'

const TouchableRipple = ({ children, ...props }) => {
  return (
    <TouchableOpacity
      {...props}
    >
      {children}
    </TouchableOpacity>
  )
}

export default TouchableRipple
