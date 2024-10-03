import { action, thunk } from 'easy-peasy'
import check from 'check-types'

import { ApiService } from '..'
import { STATUS } from '../../Constants'

import BaseModel from './Base'

const initialState = {
  data: [],
  areaList: [],
  selected: null
}

const load = thunk(async (actions, payload, { dispatch }) => {
  actions.updateStatus(STATUS.FETCHING)
  // actions.save({
  //   data: [
  //     {
  //       id: 1,
  //       typeId: 7,
  //       name: 'Community Hall',
  //       startDate: '2020-05-31T00:00:00',
  //       endDate: '2020-05-31T00:00:00',
  //       color: '#fff',
  //       bookingType: 'hourly', // 'daily'
  //       caption: '2 Hours' // '4 Days'
  //     }
  //   ]
  // })
  const response = await ApiService.fetchBookingListData(payload)
  // actions.updateStatus(STATUS.SUCCESS)
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

const loadAreaList = thunk(async (actions, payload, { dispatch }) => { 
  console.log(payload ,"payload at booking >>>>")
  const response = await ApiService.fetchBookingAreaListData(payload)

  if (response.ok) {
    actions.saveAreaList({ data: response.data })
  }
})

const saveAreaList = action((state, { data }) => {
  if (check.array(data)) {
    state.areaList = data
  } else if (check.object(data)) {
    state.areaList = initialState.areaList
  } else {
    state.areaList = data
  }
})

export default {
  ...BaseModel(),
  ...initialState,
  load,
  save,
  loadAreaList,
  saveAreaList
}
