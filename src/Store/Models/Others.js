import { action, thunk } from 'easy-peasy'
import check from 'check-types'

import { ApiService,StoreService } from '..'
import { STATUS, APP_STATE } from '../../Constants'

import BaseModel from './Base'

import { showErrorToast, showLoading, showSuccessToast, showInfoToast } from '../../Lib/Toast'

const initialState = {
  status: STATUS.NOT_STARTED,
  data: [],
  selected: null
}

const load = thunk(async (actions, payload, { dispatch }) => {
    console.log(payload,'payload others >>>>');
  actions.updateStatus(STATUS.FETCHING)
  const payloadData={
    buildingid :StoreService.getState().app.building.id,
    flatId: StoreService.getState().app.flat.flatId
}
console.log(payloadData,'payloadData others >>>>');
  const response = await ApiService.fetchOthersListData(payloadData)
console.log(response ,"response >>>>> others >>>>>");
  if (response.ok) {
    actions.save({ data: response.data })
    actions.updateStatus(STATUS.SUCCESS)
  } else {
    actions.updateStatus(STATUS.FAILED)
  }
})

const save = action((state, { data }) => {
  if (check.array(data)) { 
      console.log(data ,"others >>>>. initial");
    state.data = data.map(item => {
      const { Amount ,billDate, buildingId,description,name,otherActivityId, paidAmount,paidOn,paidVia,otherBillId,transactionNumber ,isActive, Status} = item
      return {
        id: buildingId,
        amount: Amount,
        paymentDate:'',
        dueDate: billDate,
        name: name,
        description : description,
        transactionNumber :transactionNumber,
        otherActivityId:otherActivityId,
        status:Status,
        active: isActive,
        otherBillId:otherBillId
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
