import React, { useImperativeHandle, forwardRef, useRef } from 'react'
import { Modalize } from 'react-native-modalize'

const BottomSheet = (props, ref) => {
  const { children } = props
  const modalRef = useRef(null)

  useImperativeHandle(ref, () => ({
    open: () => {
      modalRef.current.open()
    },
    close: () => {
      modalRef.current.close()
    }
  }))

  return (
    <Modalize ref={modalRef} {...props}>
      {children}
    </Modalize>
  )
}

export default forwardRef(BottomSheet)
