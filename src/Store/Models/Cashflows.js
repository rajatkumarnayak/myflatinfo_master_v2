import { action, thunk } from 'easy-peasy'
import check from 'check-types'

import { ApiService } from '..'
import { STATUS, APP_STATE } from '../../Constants'
import * as Constants from '../../Utils/Cashflow'

import BaseModel from './Base'

import { showErrorToast, showLoading } from '../../Lib/Toast'

const initialState = {
  status: STATUS.NOT_STARTED,
  data: [],
  cashBalance: null,
  bankBalance: null,
  filterData: []
}

const load = thunk(async (actions, payload, { dispatch }) => {
  actions.updateStatus(STATUS.FETCHING)

  const response = await ApiService.fetchCashflowListData(payload)
  console.log(response ,"response >>>>>>>>>>>>>>>>>> list of cash flow");
  if (response.ok) {
    actions.save({ data: response.data })
    actions.updateStatus(STATUS.SUCCESS)
  } else {
    actions.updateStatus(STATUS.FAILED)
  }
})

const save = action((state, { data: { cashBalance, bankBalance, items } }) => {
  if (check.array(items)) {
    state.data = items.map(item => {
      const { id, particulars, cashDebit, cashCredit, bankDebit, bankCredit, date, type } = item
      const credit = Number(cashCredit) + Number(bankCredit)
      const debit = Number(cashDebit) + Number(bankDebit)
      return {
        id,
        amount: credit > 0 ? credit : debit,
        subtitle: particulars,
        date,
        status: credit > 0 ? 1 : 0,
        tag: type
      }
    })
  } else if (check.object(items)) {
    state.data = initialState.data
  } else if (check.not.assigned(items)) {
    state.data = initialState.data
  } else {
    state.data = items
  }

  if (check.assigned(cashBalance)) {
    state.cashBalance = cashBalance
  }

  if (check.assigned(bankBalance)) {
    state.bankBalance = bankBalance
  }
})

const loadFilterList = thunk(async (actions, payload, { dispatch }) => {
  const response = await ApiService.fetchCashflowFilterMasterData()
console.log(response,"loadFilterList >>>>>>>>>>>>");
const dataValue = response
  if (response.ok) {
    actions.saveFilterList({ data: response.data })
  }
})

const saveFilterList = action((state, { data }) => {
  if (check.array(data)) {
    state.filterData = data.map(filter => {
      return {
        ...filter,
        items: [Constants.DEFAULT_FILTER_ITEM, ...filter.items]
      }
    })
  } else if (check.object(data)) {
    state.filterData = initialState.filterData
  } else {
    state.filterData = data
  }
})

export default {
  ...BaseModel(),
  ...initialState,
  load,
  save,
  loadFilterList,
  saveFilterList
}
