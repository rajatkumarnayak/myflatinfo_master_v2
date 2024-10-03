import { action, thunk } from 'easy-peasy'
import check from 'check-types'

import { ApiService } from '..'
import { STATUS } from '../../Constants'

import BaseModel from './Base'

const initialState = {
  allData: [],
  builderData: [],
  userData: []
}

const loadAllData = thunk(async (actions, payload, {
  dispatch
}) => {
  actions.updateStatus(STATUS.FETCHING)

  const response = await ApiService.fetchClassifiedListData()
  console.log(response ,"response >>>> for classified at service")

  if (response.ok) {
    actions.save({
      type: 'all',
      data: response.data
    })
    actions.updateStatus(STATUS.SUCCESS)
  } else {
    actions.updateStatus(STATUS.FAILED)
  }
})

const loadBuilderData = thunk(async (actions, payload, {
  getStoreState
}) => {
  actions.updateStatus(STATUS.FETCHING)

  const response = await ApiService.fetchClassifiedListByBuilderData({
    buildingId: getStoreState().app.building.id
  })

  if (response.ok) {
    actions.save({
      type: 'builder',
      data: response.data
    })
    actions.updateStatus(STATUS.SUCCESS)
  } else {
    actions.updateStatus(STATUS.FAILED)
  }
})

const loadUserData = thunk(async (actions, payload, {
  getStoreState
}) => {
  actions.updateStatus(STATUS.FETCHING)

  const response = await ApiService.fetchClassifiedListByOwnerData({
    ownerId: getStoreState().login.id
  })
  console.log(response, 'res >>>at owner id')
  if (response.ok) {
    actions.save({
      type: 'user',
      data: response.data
    })
    actions.updateStatus(STATUS.SUCCESS)
  } else {
    actions.updateStatus(STATUS.FAILED)
  }
})

const save = action((state, {
  type,
  data
}) => {
  if (check.array(data)) {
    if (type === 'all') {
      state.allData = data
    } else if (type === 'builder') {
      state.builderData = data
    } else if (type === 'user') {
      state.userData = data
    }
  } else {
    if (type === 'user') {
      state.userData = []
    }
  }
})

export default {
  ...BaseModel(),
  ...initialState,
  loadAllData,
  loadBuilderData,
  loadUserData,
  save
}
