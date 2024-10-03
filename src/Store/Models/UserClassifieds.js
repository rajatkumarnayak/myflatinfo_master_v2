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
console.log('calling at user calssidfied servic e');
  const response = await ApiService.fetchUserClassifiedListData()
  console.log(response ,"response >>>> at the usfetchUserClassifiedListData")

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

const loadMyPostData = thunk(async (actions, payload, {
  getStoreState
}) => {
  actions.updateStatus(STATUS.FETCHING)

  const response = await ApiService.fetchUserClassifiedMyBuilderData({
    buildingId: getStoreState().app.building.id
  })

  console.log(response , "My posts response >>>");

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

const loadUserMyPostData = thunk(async (actions, payload, {
  getStoreState
}) => {
  actions.updateStatus(STATUS.FETCHING)

  const response = await ApiService.fetchUserClassifiedListByUserMyPostData({
    ownerId: getStoreState().login.id
  })
  console.log(response, 'res >>> fetchUserClassifiedListByUserMyPostData')
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
  loadMyPostData,
  loadUserMyPostData,
//   loadBuilderData,
//   loadUserData,
  save
}
