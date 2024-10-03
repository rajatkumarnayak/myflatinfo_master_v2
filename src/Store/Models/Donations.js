import { action, thunk } from 'easy-peasy'
import check from 'check-types'

import { ApiService } from '..'
import { STATUS, APP_STATE } from '../../Constants'

import BaseModel from './Base'

import { showErrorToast, showLoading } from '../../Lib/Toast'

const initialState = {
  status: STATUS.NOT_STARTED,
  eventList: [],
  data: [],
  selected: null
}

const loadEventList = thunk(async (actions, payload, { dispatch }) => {
  const response = await ApiService.fetchDonationEventListData()
  console.log(response ,"response >>>>>> list ofof");
  if (response.ok) {
    actions.saveEventList({ data: response.data })
  }
})

const saveEventList = action((state, { data }) => {
  if (check.array(data)) {
  state.eventList = data.map(item => {
    console.log(item ,"item at donations >>>");
   const { donationId, name, description, image, isActive , CreatedOn, EndDate,SuperAdminAuth, StartDate} = item
      return {
        id: donationId,
        title: name,
        subtitle: description,
        image,
        active : isActive,
        admin:SuperAdminAuth,
        start:StartDate,
        end:EndDate
      
      }
    })
  } else if (check.object(data)) {
    state.eventList = initialState.data
  } else {
    state.eventList = data
  }
})

const load = thunk(async (actions, payload, { dispatch }) => {
  actions.updateStatus(STATUS.FETCHING)

  const response = await ApiService.fetchDonationListData(payload)
  console.log(response, 'response   donation load >>>>');

  if (response.ok) {
    actions.save({ data: response.data })
    actions.updateStatus(STATUS.SUCCESS)
  } else {
    actions.updateStatus(STATUS.FAILED)
  }
})

const save = action((state, { data }) => {
  if (check.array(data)) {
    const list = data.map(item => {
      const { donationId, name, dateOfDonation, transactionId, transactionAmount } = item
      return {
        id: transactionId,
        amount: transactionAmount,
        paymentDate: dateOfDonation,
        status: 1, // always paid
        subtitle: null,
        tag: name
      }
    })
    state.data = list.filter(item => item.amount !== null)
  } else if (check.object(data)) {
    state.data = initialState.data
  } else {
    state.data = data
  }
})

export default {
  ...BaseModel(),
  ...initialState,
  loadEventList,
  saveEventList,
  load,
  save
}
