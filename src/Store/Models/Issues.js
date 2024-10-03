import { action, thunk } from 'easy-peasy'
import check from 'check-types'

import { ApiService } from '..'
import { STATUS, APP_STATE } from '../../Constants'

import BaseModel from './Base'

import { showErrorToast, showLoading } from '../../Lib/Toast'

const initialState = {
  status: STATUS.NOT_STARTED,
  assigneeList: [],
  data: [],
  selected: null
}

const load = thunk(async (actions, payload, { dispatch }) => {
  actions.updateStatus(STATUS.FETCHING)

  const response = await ApiService.fetchIssueListData(payload)

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
      const { ticketNumber } = item
      return {
        ...item,
        subtitle: ticketNumber
      }
    })
  } else if (check.object(data)) {
    state.data = initialState.data
  } else {
    state.data = data
  }
})

const loadAssigneeList = thunk(async (actions, payload, { dispatch }) => {
  const response = await ApiService.fetchIssueAssigneeListData()

  if (response.ok) {
    actions.saveAssigneeList({ data: response.data })
  }
})

const saveAssigneeList = action((state, { data }) => {
  if (check.array(data)) {
    state.assigneeList = data
  } else {
    state.data = initialState.data
  }
})

export default {
  ...BaseModel(),
  ...initialState,
  load,
  save,
  loadAssigneeList,
  saveAssigneeList
}
