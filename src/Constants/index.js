import { Platform } from 'react-native'
import moment from 'moment'

import { ICON_TYPE } from '../Icons'

export const isAndroid = Platform.OS === 'android'
export const isIos = !isAndroid

export const APP_STATE = {
  PUBLIC: 'PUBLIC_LOGIN',
  PRIVATE: 'MAIN_APP',
  AUTH: 'CHECKING_LOGIN',
  UNKNOWN: 'UNKNOWN'
}

export const STATUS = {
  SUCCESS: 'SUCCESS',
  NOT_STARTED: 'NOT_STARTED',
  FETCHING: 'FETCHING',
  FAILED: 'FAILED'
}

export const LICENSE = {
  PURCHASED: 'PURCHASED',
  NOT_PURCHASED: 'NOT_PURCHASED'
}

export const LOCALES = {
  ENGLISH: { id: 1, name: 'en', label: 'ENGLISH' }
}

export const ACCOUNTS_PAYMENT = {
  PAID: {
    value: 1,
    label: 'Paid',
    color: 'success'
  },
  PENDING: {
    value: 0,
    label: 'Pending',
    color: 'warning'
  },
  NEW: {
    value: -1,
    label: 'New',
    color: 'info'
  }
}
export const API_RESPONSE_DATE_FORMAT = 'YYYY-MM-DD'
export const API_REQUEST_DATE_FORMAT = 'DD-MM-YYYY'
export const API_REQUEST_TIME_FORMAT = 'HH:mm'
export const CALENDAR_DATE_FORMAT = 'YYYY-MM-DD'
export const CALENDAR_INPUT_TIME_FORMAT = 'h:mma'
export const GENERAL_DAY_DISPLAY_FORMAT = 'Do MMMM YYYY'

export const GATEPASS_LIST_ITEM_DATETIME_DISPLAY_FORMAT = 'ddd, Do MMM, HH:mm'
export const GATEPASS_TIME_FORMAT = 'HH:mm'

export const ACTIVITY_DISPLAY_DATE_FORMAT = 'ddd, Do MMM YYYY'

export const SETTING_ITEM_BLOCK_VISITORS_API_RESPONSE_DATE_FORMAT = 'DD/MM/YYYY'
export const SETTING_ITEM_BLOCK_VISITORS_API_RESPONSE_TIME_FORMAT = 'HH:mm:ss'
export const SETTING_ITEM_BLOCK_VISITORS_DATE_DISPLAY_FORMAT = 'ddd, Do MMM YYYY'
export const SETTING_ITEM_BLOCK_VISITORS_TIME_DISPLAY_FORMAT = 'HH:mm'

export const GATEPASS_DEFAULT_START_DATE = moment().format(CALENDAR_DATE_FORMAT)
export const GATEPASS_DEFAULT_END_DATE = moment().format(CALENDAR_DATE_FORMAT)
export const GATEPASS_DEFAULT_START_TIME = moment().add(1, 'hours').format('HH:00')
export const GATEPASS_DEFAULT_END_TIME = moment().add(1, 'hours').add(30, 'minutes').format('HH:00')

export const BOOKING_DEFAULT_START_DATE = moment().add(1, 'days').format(CALENDAR_DATE_FORMAT)
export const BOOKING_DEFAULT_END_DATE = moment().add(1, 'days').format(CALENDAR_DATE_FORMAT)
export const BOOKING_DISPLAY_DATE_FORMAT = 'ddd, Do MMM YYYY'

export const ACTIVITY_ATTENDANCE = {
  YES: {
    value: 1,
    label: 'Yes',
    color: 'success',
    icon: 'check',
    iconType: ICON_TYPE.ANT_ICON
  },
  MAYBE: {
    value: 3,
    label: 'Maybe',
    color: 'info',
    icon: 'question',
    iconType: ICON_TYPE.ANT_ICON
  },
  NO: {
    value: 2,
    label: 'No',
    color: 'error',
    icon: 'cancel',
    iconType: ICON_TYPE.ANT_ICON
  }
}

export const POLL_STATUS = {
  OPEN: {
    value: 0,
    label: 'Open',
    color: 'success'
  },
  CLOSED: {
    value: 2,
    label: 'Closed',
    color: 'error'
  }
}

export const GATEPASS_STATUS = {
  VALID: {
    value: 1,
    label: 'Valid',
    color: 'success'
  },
  INVALID: {
    value: 0,
    label: 'Revoked',
    color: 'error'
  }
}

export const GATEPASSVALIDATION_STATUS = {
  VALIDATED: {
    value: 1
  },
  NOTVALIDATED: {
    value: 0
  }
}
