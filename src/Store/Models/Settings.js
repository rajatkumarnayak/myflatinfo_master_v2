import { action, thunk } from 'easy-peasy'
import check from 'check-types'
import { ApiService } from '..'
import { STATUS } from '../../Constants'
import BaseModel from './Base'
const initialState = {
  blockVisitorsData: {
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    isActive: 0
  }
}

const activateBlockVisitors = thunk(async (actions, payload, { dispatch }) => {
  actions.updateStatus(STATUS.FETCHING)

  const response = await ApiService.fetchSetting({ ...payload, module: 'visitors', intent: 'block', action: 'activate' })

  if (response.ok) {
    actions.saveBlockVisitors({ data: response.data })
    actions.updateStatus(STATUS.SUCCESS)
  } else {
    actions.updateStatus(STATUS.FAILED)
  }
})

const deactivateBlockVisitors = thunk(async (actions, payload, { dispatch }) => {
  actions.updateStatus(STATUS.FETCHING)
  const response = await ApiService.fetchSetting({ ...payload, module: 'visitors', intent: 'block', action: 'deactivate' })

  if (response.ok) {
    actions.saveBlockVisitors({ data: response.data })
    actions.updateStatus(STATUS.SUCCESS)
  } else {
    actions.updateStatus(STATUS.FAILED)
  }
})

const statusOfBlockVisitors = thunk(async (actions, payload, { dispatch }) => {
  actions.updateStatus(STATUS.FETCHING)
  const response = await ApiService.fetchSetting({ ...payload, module: 'visitors', intent: 'block', action: 'status' })

  if (response.ok) {
    actions.saveBlockVisitors({ data: response.data })
    actions.updateStatus(STATUS.SUCCESS)
  } else {
    actions.updateStatus(STATUS.FAILED)
  }
})

const saveBlockVisitors = action((state, { data }) => {
  if (check.object(data)) {
    state.blockVisitorsData = {
      ...data,
      isActive: data.isActive === 1
    }
  }
})

export default {
  // include BaseModel
  ...BaseModel(),
  // include all thunks or actions defined separately
  ...initialState,
  activateBlockVisitors,
  deactivateBlockVisitors,
  statusOfBlockVisitors,
  saveBlockVisitors
}
