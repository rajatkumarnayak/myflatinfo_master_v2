import React from 'react'
import { iOSColors } from 'react-native-typography'
import check from 'check-types'
import { ACTIVITY_ATTENDANCE } from '../../Constants'
import { Icon, ICON_TYPE } from '../../Icons'

export default ({ data, size, outline, style }) => {
  const { isAttending } = data
  let icon = ''
  let color = ''

  if (isAttending === ACTIVITY_ATTENDANCE.YES.value) {
    icon = `checkcircle${outline ? 'o' : ''}`
    color = iOSColors.green
  } else if (isAttending === ACTIVITY_ATTENDANCE.NO.value) {
    icon = `closecircle${outline ? 'o' : ''}`
    color = iOSColors.red
  } else if (isAttending === ACTIVITY_ATTENDANCE.MAYBE.value) {
    icon = `questioncircle${outline ? 'o' : ''}`
    color = iOSColors.blue
  }

  if (check.not.assigned(isAttending) || isAttending === 0) {
    return <></>
  }

  return <Icon origin={ICON_TYPE.ANT_ICON} name={icon} size={size || 20} color={color} style={style} />
}
