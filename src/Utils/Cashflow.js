import moment from 'moment'

export const DATE_FORMAT = 'YYYY-MM-DD'
export const DEFAULT_START_DATE = moment().format('YYYY-MM-01')
export const DEFAULT_END_DATE = moment().format(DATE_FORMAT)
export const TYPE_FILTER_DONATION_ITEM_ID = 2
export const DEFAULT_SELECTED_FILTER_ITEM_ID = -1
export const DEFAULT_FILTER_ITEM = { id: DEFAULT_SELECTED_FILTER_ITEM_ID, text: 'All' }
export const DEFAULT_TYPE_FILTER = { id: null, text: 'Type', items: [DEFAULT_FILTER_ITEM] }
export const DEFAULT_DONATION_TYPE_FILTER = { id: null, text: 'Donation Type', items: [DEFAULT_FILTER_ITEM] }
