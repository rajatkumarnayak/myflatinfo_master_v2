import { action, thunk } from 'easy-peasy'
import check from 'check-types'

import { ApiService } from '..'
import { STATUS, APP_STATE } from '../../Constants'

import BaseModel from './Base'

import { showErrorToast, showLoading } from '../../Lib/Toast'

const initialState = {
  status: STATUS.NOT_STARTED,
  data: null,
  selected: null
}

const load = thunk(async (actions, payload, { dispatch }) => {
  actions.updateStatus(STATUS.FETCHING)

  const response = await ApiService.fetchPollListData(payload)

  if (response.ok) {
    actions.save({ data: response.data })
    actions.updateStatus(STATUS.SUCCESS)
  } else {
    actions.updateStatus({
      status: STATUS.FAILED,
      statusCode: response.status,
      failureReason: response.data
    })
  }
})

const save = action((state, { data }) => {
  if (check.array(data)) {
    state.data = data
  } else if (check.object(data)) {
    state.data = initialState.data
  } else {
    state.data = data
  }
})

export default {
  // include BaseModel
  ...BaseModel(),
  // include all thunks or actions defined separately
  ...initialState,
  load,
  save
}
