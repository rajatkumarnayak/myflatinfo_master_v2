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

  const response = await ApiService.fetchMaintenanceListData(payload)
  console.log(response ,"response >>>>>>>>>>>>>>>>>>> lll");
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
      const { maintenanceId, billAmount, billDate, paymentDate, billDueDate, billNumber,
         status, billType, name } = item
         const {AmountPaid, BillDate, BillNumber,MaintenanceId, MaintenanceTransactionId, Name, PaymentDate,Status, TransactionNumber,BillAmount}= item
      return {
        id: MaintenanceId,
        amount: BillAmount ? BillAmount :AmountPaid,
        paid:AmountPaid,
        paymentDate,
        dueDate: BillDate,
        status:Status
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
