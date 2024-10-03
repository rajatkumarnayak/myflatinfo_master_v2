import { action, thunk } from 'easy-peasy'
import check from 'check-types'

import { ApiService } from '..'
import { STATUS } from '../../Constants'

import BaseModel from './Base'

import { showErrorToast, showLoading } from '../../Lib/Toast'

const initialState = {
  status: STATUS.NOT_STARTED,
  data: [],
  selected: null
}

const load = thunk(async (actions, payload, { dispatch }) => {
  actions.updateStatus(STATUS.FETCHING)

  const response = await ApiService.fetchActivityListData(payload)

  if (response.ok) {
    actions.save({ data: response.data })
    actions.updateStatus(STATUS.SUCCESS)
  } else {
    actions.updateStatus(STATUS.FAILED)
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
  ...BaseModel(),
  ...initialState,
  load,
  save
}
