import React from 'react'
import ImageView from 'react-native-image-viewing'

const ModalImageViewer = (props) => {
  console.log(props,"props >>>");
  return (
    <ImageView {...props} />
  )
}

export default ModalImageViewer