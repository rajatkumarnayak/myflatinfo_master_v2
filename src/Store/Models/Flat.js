import { action, thunk } from 'easy-peasy'
import check from 'check-types'

import { ApiService } from '..'
import { STATUS, APP_STATE } from '../../Constants'

import BaseModel from './Base'

import { showErrorToast, showLoading } from '../../Lib/Toast'

const initialState = {
  status: STATUS.NOT_STARTED,
  data: null
}

const load = thunk(async (actions, payload, { dispatch }) => {
  actions.updateStatus(STATUS.FETCHING)

  const response = await ApiService.fetchFlatDetailsData(payload)

  if (response.ok) {
    actions.saveDetails({ data: response.data })
    actions.updateStatus(STATUS.SUCCESS)
  } else {
    actions.updateStatus(STATUS.FAILED)
  }
})

const save = action((state, { data }) => {
  state.data = data
})

const FlatInfoModel = {
  // include BaseModel
  ...BaseModel(),
  // include all thunks or actions defined separately
  ...initialState,
  load,
  save
}

export default FlatInfoModel
