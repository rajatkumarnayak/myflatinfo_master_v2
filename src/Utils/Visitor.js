import { iOSColors } from 'react-native-typography'

import { ICON_TYPE } from '../Icons'

export const STATUS = {
  // FREE_TO_MOVE: {
  //   value: 1,
  //   label: 'Free to Move',
  //   actionLabel: 'Move Freely',
  //   color: 'info',
  //   icon: 'walk',
  //   iconType: ICON_TYPE.MATERIAL_COMMUNITY
  // },
  ONGOING: {
      value: 1,
      label: 'OnGoing',
      actionLabel: 'OnGoing',
      color: 'info',
      icon: 'walk',
      iconType: ICON_TYPE.MATERIAL_COMMUNITY
    },
  BLOCKED: {
    value: 2,
    label: 'Blocked',
    actionLabel: 'Block',
    color: 'error',
    icon: 'cancel',
    iconType: ICON_TYPE.ANT_ICON
  },
  ALLOWED: {
    value: 3,
    label: 'Allowed',
    actionLabel: 'Allow',
    color: 'success',
    icon: 'check',
    iconType: ICON_TYPE.ANT_ICON
  },
  COMPLETED: {
    value: 4,
    label: 'Completed',
    actionLabel: 'Completed',
    color: 'success',
    icon: 'check',
    iconType: ICON_TYPE.ANT_ICON
  },
  REQUESTPENDING: {
    value: 5,
    label: 'Request Pending',
    actionLabel: 'Request Pending',
    color: 'success',
    icon: 'check',
    iconType: ICON_TYPE.ANT_ICON
  },
  REQUESTEXPIRED: {
    value: 6,
    label: 'Request Expired',
    actionLabel: 'Request Expired',
    color: 'success',
    icon: 'check',
    iconType: ICON_TYPE.ANT_ICON
  }
}

export const ACTION_STATUS = {
  ACTIVE: {
    value: 1
  },
  INACTIVE: {
    value: 0
  }
}

//export const STATUS_TEXTS = ['Free to Move', 'Blocked', 'Allowed']
export const STATUS_TEXTS = ['OnGoing', 'Blocked', 'Allow', 'Completed',  'Request Pending', 'Request Expired']
export const CHANGE_STATUS_TEXTS = ['Move Freely', 'Allow', 'Block']

export const statusColor = (status) => {
  if (status === 3) {
    return iOSColors.green
  }

  if (status === 2) {
    return iOSColors.red
  }

  return iOSColors.blue
}

export const confirmText = (selectedStatus) => {
  if (selectedStatus === 1) { // free to move
    return 'Are you sure you want to let the visitor move freely?'
  } else if (selectedStatus === 2) { // blocked
    return 'Are you sure you want to block the visitor?'
  }

  return 'Are you sure you want to allow the visitor?'
}
