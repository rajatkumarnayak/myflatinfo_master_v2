import { action, thunk } from 'easy-peasy'
import check from 'check-types'

import { STATUS, APP_STATE, LICENSE } from '../../Constants'

const BaseModel = () => ({
  status: STATUS.NOT_STARTED,
  failureReason: null,
  license: LICENSE.PURCHASED,
  updateStatus: action((state, data) => {
    if (check.object(data)) {
      const { status, statusCode, failureReason } = data
      state.status = status
      if (status === STATUS.FAILED) {
        state.failureReason = failureReason
      }
      if (statusCode === 401) {
        state.license = LICENSE.NOT_PURCHASED
      }
    } else {
      state.status = data
    }
  }),
  mergeState: action((state, extra) => {
    Object.assign(state, extra)
  })
})

export default BaseModel
