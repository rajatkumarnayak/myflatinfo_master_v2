import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'

const RupeeIcon = ({ size, style }) => {
  return (
    <Icon
      size={size || 16}
      name='rupee-sign'
      style={style}
    />
  )
}

export default RupeeIcon
