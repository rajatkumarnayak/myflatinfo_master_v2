import { action, thunk } from 'easy-peasy'
import check from 'check-types'

import { ApiService } from '..'
import { STATUS, APP_STATE } from '../../Constants'

import BaseModel from './Base'

import { showErrorToast, showLoading } from '../../Lib/Toast'

const initialState = {
  status: STATUS.NOT_STARTED,
  data: [],
  selected: null
}

const load = thunk(async (actions, payload, { dispatch }) => {
  actions.updateStatus(STATUS.FETCHING)

  const response = await ApiService.fetchCorpusListData(payload)
  console.log(response ,"response >>>>> at corpusssss");

  if (response.ok) {
    actions.save({ data: response.data })
    actions.updateStatus(STATUS.SUCCESS)
  } else {
    actions.updateStatus(STATUS.FAILED)
  }
})

const save = action((state, { data }) => {
  if (check.array(data)) {
    state.data = data.map(item => {
      console.log(item,"at corpus >>>");
      const { carpusId, billAmount, billDate, billDueDate, paymentDate, billNumber, status, billType, name, isActive } = item
      return {
        id: carpusId,
        amount: billAmount,
        paymentDate,
        dueDate: billDueDate,
        active :isActive ,
        status
      }
    })
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
