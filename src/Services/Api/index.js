import {
  create
} from 'apisauce'

import {
  BASE_URL
} from '../../Config'
import {
  StoreService
} from '../../Store'
// import apiMonitor from './Monitor'
// import { Platform } from 'react-native'
// import setInterceptor from './Interceptor'
// import useTranslation from '../../i18n'

export const URIS = {
  LOGIN: 'api/Login',
  SETTING: (module, intent, action) => `api/settings/${module}/${intent}/${action}`,
  RESET_PASSWORD: 'api/Login/ResetPassword',
  CHANGE_PASSWORD: 'api/User/ChangePassword',
  LOGOUT: 'api/login/Logout',
  BUILDING: 'api/Building',
  FLAT: 'api/Flat',
  NOTICEBOARD: 'api/Noticeboard',
  PARKING: 'api/Parking',
  VISITOR: 'api/Visitors',
  GATEPASS: 'api/Gatepass',
  FAMILY_MEMBER: 'api/Family',
  MAINTENANCE: 'api/Maintenance',
  OTHERS: 'api/Others',
  DONATION_EVENT: 'api/Donation/Events',
  DONATION: 'api/Donation',
  CORPUS: 'api/Carpus',
  CASHFLOW: 'api/IncomeNExpenseLogs',
  CASHFLOW_FILTERS: 'api/IncomeNExpenseLogs/FilterData',
  ISSUE_ASSIGNEE: 'api/Issue/Assignees',
  ISSUE: 'api/Issue',
  BOOKING_AREA: 'api/Booking/Types',
  BOOKING: 'api/Booking',
  ACTIVITY: 'api/Activity',
  SURVEY: 'api/Survey',
  POLL: 'api/CommitteePoll',
  CLASSIFIEDS_ALL: 'api/BuilderClassifieds/GetAllclassifieds',
  CLASSIFIEDS_BY_BUILDER: 'api/BuilderClassifieds/GetClassifiedsByBuildingId?buildingId=',
  CLASSIFIEDS_BY_OWNER: 'api/BuilderClassifieds/GetClassifiedsByOwnerId?ownerId=',
  CLASSIFIED: 'api/BuilderClassifieds/GetClassifiedsById?classifiedId=',
  CLASSIFIED_LIKE: 'api/BuilderClassifieds/LikeClassified',
  GETNOTIFICATIONS: 'api/OwnerNtenantNotifications/GetNotifications',
  ALLOWNOTIFICATION: 'api/OwnerNtenantNotifications/AllowNotifications',
  BLOCKNOTIFICATIONS: 'api/OwnerNtenantNotifications/BlockNotifications',
  GETALLUSERCLASSIFIEDS: 'api/UserClassifieds/GetAllUserClassifieds',
  BASEDONCLASSIFIEDID: 'api/UserClassifieds/GetUserClassified',
  BASEDONBUILDINGID: 'api/UserClassifieds/GetUserClassifiedsByBuilding',
  BASEDONUSERPOSTS: 'api/UserClassifieds/GetUserClassifiedsByUser',
  CREATEPOST: 'api/UserClassifieds/AddUserClassified',
  UPDATEPOST: 'api/UserClassifieds/ResubmitClassified',
  DELETEIMAGE: 'api/UserClassifieds/DeleteClassifiedImage',
  DELETEPOST: 'api/UserClassifieds/DeleteClassified',
  SECURITYVISITORS: 'api/Visitors/AllVisitors',
  VALIDATECODE: 'api/Visitors/ValidateGatePass',
  SECURITYGATEPASS: 'api/Visitors/AllGatepasses',
  SECURITYCREATEVISITOR: 'api/Visitors/AddVisitor',
  ALLBLOCKS:'api/Building/ListOfAllBlocksOfABuilding',
  ALLFLATS:'api/Building/ListOfAllFlatsOfABlock'


}

const createApiClient = (baseURL = BASE_URL) => {
  const api = create({
    baseURL,
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json'
    },
    timeout: 15000
  })
  // const defaultPayload = () => ({
  //   flatId: StoreService.getState().app.flat ? StoreService.getState().app.flat.flatId : '-1',
  //   buildingId: StoreService.getState().app.building.id
  // })
  const defaultPayload = () => ({
    flatId: StoreService.getState().app.flat ? StoreService.getState().app.flat.flatId : '-1',
    userId: StoreService.getState().login.id,
    buildingId: StoreService.getState().app.building.id
  })

  // api.addMonitor(apiMonitor);
  // use interceptor if using oAuth for authentication
  // setInterceptor(api);

  const setAuthorizationHeader = () => {
    return api.setHeader('UserId', StoreService.getState().login.id)
  }

  const setHeaders = (params) => {
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const element = params[key]
        api.setHeader(key, element)
      }
    }
  }

  const fetchIntroData = payload => {
    return api.get(URIS.INTRO)
  }

  const loginUser = payload => {
    const body = {
      buildingId: payload.building.id,
      phoneNumber: payload.phoneNumber,
      passWord: payload.password
    }
    return api.post(URIS.LOGIN, body)
  }

  // const loginUser = payload => {
  //   console.log(payload,"at loging claakindf")
  //   const body = {
  //     buildingId: payload.building.id,
  //     phoneNumber: payload.phoneNumber,
  //     passWord: payload.password,
  //     deviceID : payload.deviceID
  //   }
  //   return api.post(URIS.LOGIN, body)
  // }

  const logOutUser = payload => {
    console.log(payload, "at LOGOUT AT")
    const body = {
      userId: payload.userId,
      deviceID: payload.deviceID
    }
    return api.delete(URIS.LOGOUT, body)
  }

  const getNotifications = payload => {
    console.log(payload, 'getting here >>>')
    const body = {
      userid: payload
    }
    return api.post(URIS.GETNOTIFICATIONS, body)
  }

  const allowNotifications = payload => {
    console.log(payload, 'allowNotifications getting here >>>')
    const body = {
      ownerid: payload.ownerid,
      key: payload.key
    }
    return api.post(URIS.ALLOWNOTIFICATION, body)
  }
  const blockedNotifications = payload => {
    console.log(payload, ' blockedNotifications getting here >>>')
    const body = {
      ownerid: payload.ownerid,
      key: payload.key
    }
    return api.post(URIS.BLOCKNOTIFICATIONS, body)
  }

  const fetchSetting = payload => {
    const {
      module,
      intent,
      action
    } = payload

    const body = {
      ...defaultPayload(),
      ...payload
    }
    delete body.module
    delete body.intent
    delete body.action
    delete body.userId
    setAuthorizationHeader()
    return api.post(URIS.SETTING(module, intent, action), body)
  }

  const resetPassword = payload => {
    const body = {
      buildingId: payload.building.id,
      phoneNumber: payload.phoneNumber,
      email: payload.email
    }
    return api.post(URIS.RESET_PASSWORD, body)
  }

  const changePassword = payload => {
    const body = {
      ...defaultPayload(),
      oldPassword: payload.oldPassword,
      newPassword: payload.newPassword
    }
    setAuthorizationHeader()
    return api.post(URIS.CHANGE_PASSWORD, body)
  }

  const fetchBuildingListData = payload => {
    return api.post(URIS.BUILDING)
  }

  const fetchFlatListData = payload => {
    const body = {
      ...defaultPayload()
    }
    setAuthorizationHeader()
    return api.post(URIS.FLAT, body)
  }

  const fetchFlatDetailsData = payload => {
    const body = {
      flatId: StoreService.getState().app.flat ? StoreService.getState().app.flat.flatId : '-1'
    }
    setAuthorizationHeader()
    return api.post(URIS.FLAT, body)
  }

  const fetchNoticeboardListData = payload => {
    const body = {
      ...defaultPayload()
    }
    setAuthorizationHeader()
    return api.post(URIS.NOTICEBOARD, body)
  }

  const fetchVisitorListData = payload => {
    const {
      startDate,
      endDate
    } = payload
    const body = {
      ...defaultPayload(),
      startDate,
      endDate
    }
    setAuthorizationHeader()
    return api.post(URIS.VISITOR, body)
  }

  const fetchVisitorItemData = payload => {
    setAuthorizationHeader()
    return api.get(URIS.VISITOR + '/' + payload.id)
  }

  const updateVisitorItemData = payload => {
    setAuthorizationHeader()
    return api.patch(URIS.VISITOR, payload)
  }

  const fetchGatepassListData = payload => {
    const body = {
      ...defaultPayload()
    }
    setAuthorizationHeader()
    return api.post(URIS.GATEPASS, body)
  }

  const putGatepassItemData = payload => {
    const {
      startDate,
      endDate,
      startTime,
      endTime,
      primaryVisitor
    } = payload
    const body = {
      ...defaultPayload(),
      primaryVisitor,
      startDate,
      endDate,
      startTime,
      endTime
    }
    setAuthorizationHeader()
    return api.put(URIS.GATEPASS, body)
  }
  const patchGatepassItemData = payload => {
    const body = {
      ...defaultPayload(),
      ...payload
    }
    setAuthorizationHeader()
    return api.patch(URIS.GATEPASS, body)
  }
  const fetchParkingListData = payload => {
    const {
      startDate,
      endDate
    } = payload
    console.log(payload, 'at mainatanaece ');
    const body = {
      ...defaultPayload(),
      startDate,
      endDate
    }
    setAuthorizationHeader()
    return api.post(URIS.PARKING, body)
  }

  const fetchFamilyMemberListData = payload => {
    const {
      startDate,
      endDate
    } = payload
    const body = {
      ...defaultPayload(),
      startDate,
      endDate
    }
    setAuthorizationHeader()
    return api.post(URIS.FAMILY_MEMBER, body)
  }

  const fetchMaintenanceListData = payload => {
    const {
      startDate,
      endDate,
    } = payload
    console.log(payload, 'at mainatanaece ');
    const body = {
      ...defaultPayload(),
      startDate,
      endDate,
    }
    setAuthorizationHeader()
    return api.post(URIS.MAINTENANCE, body)
  }

  const fetchOthersListData = payload => {
    const body = {

      buildingid: payload.buildingid,
      flatId: payload.flatId
    }
    setAuthorizationHeader()
    return api.post(URIS.OTHERS, body)
  }

  const fetchMaintenanceItemData = payload => {
    console.log(payload, "payload at maintenacnce >>>");
    setAuthorizationHeader()
    return api.get(URIS.MAINTENANCE + '/' + payload.id)
  }

  const fetchOthersItemData = payload => {
    const body = {
      otherBillId: payload.otherBillId,
      FlatId: payload.flatId
    }
    setAuthorizationHeader()
    return api.get(URIS.OTHERS, body)
  }

  const updateMaintenanceItemData = payload => {
    console.log(payload, "payload >> at mailnatnce");
    setAuthorizationHeader()
    return api.patch(URIS.MAINTENANCE, payload)
  }

  const updateOthersItemData = payload => {
    console.log(payload, "payload >> at update");
    setAuthorizationHeader()
    return api.put(URIS.OTHERS, payload)
  }



  const fetchDonationEventListData = payload => {
    const {
      buildingId
    } = defaultPayload()
    const body = {
      buildingId
    }
    setAuthorizationHeader()
    return api.post(URIS.DONATION_EVENT, body)
  }

  const fetchDonationListData = payload => {
    const {
      startDate,
      endDate
    } = payload
    const body = {
      ...defaultPayload(),
      startDate,
      endDate
    }
    setAuthorizationHeader()
    return api.post(URIS.DONATION, body)
  }

  const fetchDonationItemData = payload => {
    console.log(payload, "payload >>> donation >>");
    setAuthorizationHeader()
    return api.get(URIS.DONATION + '/' + payload.id)
  }

  const putDonationItemData = payload => {
    const body = {
      ...defaultPayload(),
      ...payload
    }
    setAuthorizationHeader()
    return api.put(URIS.DONATION, body)
  }

  const fetchCorpusListData = payload => {
    const {
      startDate,
      endDate
    } = payload
    const body = {
      ...defaultPayload(),
      startDate,
      endDate
    }
    setAuthorizationHeader()
    return api.post(URIS.CORPUS, body)
  }

  const fetchCorpusItemData = payload => {
    setAuthorizationHeader()
    return api.get(URIS.CORPUS + '/' + payload.id)
  }

  const updateCorpusItemData = payload => {
    setAuthorizationHeader()
    return api.patch(URIS.CORPUS, payload)
  }

  const fetchCashflowFilterMasterData = () => {
    const body = {
      ...defaultPayload()
    }
    console.log(body, "body >>>>>>>>>>>>>>>>>>");
    return api.post(URIS.CASHFLOW_FILTERS, body)
  }

  const fetchCashflowListData = payload => {
    const {
      startDate,
      endDate,
      filters
    } = payload
    const body = {
      ...defaultPayload(),
      startDate,
      endDate,
      filters
    }
    setAuthorizationHeader()
    return api.post(URIS.CASHFLOW, body)
  }

  const fetchIssueAssigneeListData = payload => {
    const body = {
      ...defaultPayload()
    }
    setAuthorizationHeader()
    return api.post(URIS.ISSUE_ASSIGNEE, body)
  }

  const fetchIssueListData = payload => {
    const {
      startDate,
      endDate
    } = payload
    const body = {
      ...defaultPayload(),
      startDate,
      endDate
    }
    setAuthorizationHeader()
    return api.post(URIS.ISSUE, body)
  }

  const fetchIssueItemData = payload => {
    setAuthorizationHeader()
    return api.get(URIS.ISSUE + '/' + payload.id)
  }

  const putIssueItemData = payload => {
    const body = {
      ...defaultPayload(),
      ...payload
    }
    setAuthorizationHeader()
    return api.put(URIS.ISSUE, body)
  }

  const fetchBookingAreaListData = payload => {
    console.log(payload, "paylod >>>")
    const body = {
      ...defaultPayload()
    }
    setAuthorizationHeader()
    return api.post(URIS.BOOKING_AREA, body)
  }

  const fetchBookingListData = payload => {
    const {
      startDate,
      endDate
    } = payload
    const body = {
      ...defaultPayload(),
      startDate,
      endDate
    }
    setAuthorizationHeader()
    return api.post(URIS.BOOKING, body)
  }

  const fetchBookingItemData = payload => {
    setAuthorizationHeader()
    return api.get(URIS.BOOKING + '/' + payload.id)
  }

  const putBookingItemData = payload => {
    const body = {
      ...defaultPayload(),
      ...payload
    }
    setAuthorizationHeader()
    return api.put(URIS.BOOKING, body)
  }
  const cancelBookingItem = payload => {
    setAuthorizationHeader()
    return api.patch(URIS.BOOKING + '/' + payload.id + '/Cancel')
  }

  const fetchActivityListData = payload => {
    const {
      startDate,
      endDate
    } = payload
    const body = {
      ...defaultPayload(),
      startDate,
      endDate
    }
    setAuthorizationHeader()
    return api.post(URIS.ACTIVITY, body)
  }

  const fetchActivityItemData = payload => {
    setAuthorizationHeader()
    return api.get(URIS.ACTIVITY + '/' + payload.id)
  }

  const putActivityItemData = payload => {
    const body = {
      ...defaultPayload(),
      ...payload
    }
    setAuthorizationHeader()
    return api.put(URIS.ACTIVITY, body)
  }

  const updateActivityItemData = payload => {
    const body = {
      ...defaultPayload(),
      ...payload
    }
    setAuthorizationHeader()
    return api.patch(URIS.ACTIVITY, body)
  }

  const fetchSurveyListData = payload => {
    const {
      startDate,
      endDate
    } = payload
    const body = {
      ...defaultPayload(),
      startDate,
      endDate
    }
    setAuthorizationHeader()
    return api.post(URIS.SURVEY, body)
  }

  const fetchSurveyItemData = payload => {
    setAuthorizationHeader()
    return api.get(URIS.SURVEY + '/' + payload.id)
  }

  const updateSurveyItemData = payload => {
    const body = {
      ...defaultPayload(),
      ...payload
    }
    setAuthorizationHeader()
    return api.patch(URIS.SURVEY, body)
  }

  const fetchPollListData = payload => {
    const {
      startDate,
      endDate
    } = payload
    const body = {
      ...defaultPayload(),
      startDate,
      endDate
    }
    setAuthorizationHeader()
    return api.post(URIS.POLL, body)
  }

  const fetchPollItemData = payload => {
    setAuthorizationHeader()
    return api.get(URIS.POLL + '/' + payload.id)
  }

  const updatePollItemData = payload => {
    const body = {
      ...defaultPayload(),
      ...payload
    }
    setAuthorizationHeader()
    return api.patch(URIS.POLL, body)
  }

  const fetchClassifiedListData = payload => {
    setAuthorizationHeader()
    return api.get(URIS.CLASSIFIEDS_ALL)
  }

  const fetchUserClassifiedListData = payload => {
    setAuthorizationHeader()
    return api.get(URIS.GETALLUSERCLASSIFIEDS)
  }

  const fetchClassifiedListByBuilderData = payload => {
    setAuthorizationHeader()
    return api.get(URIS.CLASSIFIEDS_BY_BUILDER + payload.buildingId)
  }

  const fetchUserClassifiedMyBuilderData = payload => {
    setAuthorizationHeader()
    const body = {
      buildingId: payload.buildingId
    }
    return api.get(URIS.BASEDONBUILDINGID, body)
  }

  const fetchClassifiedListByOwnerData = payload => {
    setAuthorizationHeader()
    return api.get(URIS.CLASSIFIEDS_BY_OWNER + payload.ownerId)
  }

  const fetchUserClassifiedListByUserMyPostData = payload => {
    setAuthorizationHeader()
    const body = {
      userId: payload.ownerId
    }
    return api.get(URIS.BASEDONUSERPOSTS, body)
  }

  const fetchClassifiedItemData = payload => {
    setAuthorizationHeader()
    return api.get(URIS.CLASSIFIED + payload.classifiedId)
  }

  const postClassifiedItemLikeData = payload => {
    console.log(payload, 'payload >>>>')
    setAuthorizationHeader()
    return api.post(URIS.CLASSIFIED_LIKE, payload)
  }

  const createPostClassified = payload => {
    console.log(payload, 'payload >>>>')
    setAuthorizationHeader()
    return api.post(URIS.CREATEPOST, payload)
  }

  const updatePostClassified = payload => {
    console.log(payload, 'payload >>>>')
    setAuthorizationHeader()
    return api.put(URIS.UPDATEPOST, payload)
  }



  const fetchUserClassifiedItemData = payload => {
    const body = {
      classifiedId: payload.classifiedId
    }
    setAuthorizationHeader()
    return api.get(URIS.BASEDONCLASSIFIEDID, body)
  }

  const deleteUserClassifiedItemData = payload => {
    const body = {
      classifiedId: payload.classifiedId
    }
    setAuthorizationHeader()
    return api.delete(URIS.DELETEPOST, body)
  }


  const securityVisitors = payload => {
    setAuthorizationHeader()
    console.log(payload,"payload >>>");
    const body = {
      BuildingId: payload.BuildingId
    }
    return api.get(URIS.SECURITYVISITORS, body)
  }

  const securityGatepass = payload => {
    setAuthorizationHeader()
    const body = {
      BuildingId: payload.BuildingId
    }
    return api.get(URIS.SECURITYGATEPASS, body)
  }

  const securityCreateVisitor = payload => {
    setAuthorizationHeader()
   console.log(payload,"at the edge");
    return api.post(URIS.SECURITYCREATEVISITOR, payload)
  }

  const validateCode = payload => {
    setAuthorizationHeader()
    const body = {
      gatePassCode: payload.gatePassCode
    }
    return api.get(URIS.VALIDATECODE, body)
  }

  const listOfAllBlocks = payload => {
    setAuthorizationHeader()
    const body = {
      BuildingId: payload.BuildingId
    }
    return api.get(URIS.ALLBLOCKS, body)
  }

  const listOfAllFlats = payload => {
    setAuthorizationHeader()
    const body = {
      BlockId: payload.BlockId
    }
    return api.get(URIS.ALLFLATS, body)
  }






  // kickoff our api functions
  return {
    // client modifiers
    setAuthorizationHeader,
    // checkAppVersion,
    fetchIntroData,
    fetchBuildingListData,
    loginUser,
    fetchSetting,
    resetPassword,
    fetchOthersListData,
    changePassword,
    fetchFlatListData,
    fetchFlatDetailsData,
    fetchNoticeboardListData,
    fetchParkingListData,
    fetchVisitorListData,
    fetchVisitorItemData,
    updateVisitorItemData,
    fetchGatepassListData,
    putGatepassItemData,
    patchGatepassItemData,
    fetchOthersItemData,
    fetchFamilyMemberListData,
    fetchMaintenanceListData,
    fetchMaintenanceItemData,
    updateMaintenanceItemData,
    fetchDonationEventListData,
    fetchDonationListData,
    fetchDonationItemData,
    putDonationItemData,
    fetchCorpusListData,
    fetchCorpusItemData,
    updateCorpusItemData,
    fetchCashflowFilterMasterData,
    fetchCashflowListData,
    fetchIssueAssigneeListData,
    fetchIssueListData,
    fetchIssueItemData,
    putIssueItemData,
    fetchBookingAreaListData,
    fetchBookingListData,
    fetchBookingItemData,
    putBookingItemData,
    fetchActivityListData,
    fetchActivityItemData,
    putActivityItemData,
    updateActivityItemData,
    fetchSurveyListData,
    fetchSurveyItemData,
    updateSurveyItemData,
    fetchPollListData,
    fetchPollItemData,
    updatePollItemData,
    cancelBookingItem,
    fetchClassifiedListData,
    fetchClassifiedListByBuilderData,
    fetchClassifiedListByOwnerData,
    fetchClassifiedItemData,
    postClassifiedItemLikeData,
    getNotifications,
    allowNotifications,
    blockedNotifications,
    logOutUser,
    fetchUserClassifiedListData,
    fetchUserClassifiedMyBuilderData,
    fetchUserClassifiedListByUserMyPostData,
    createPostClassified,
    fetchUserClassifiedItemData,
    deleteUserClassifiedItemData,
    updatePostClassified,
    updateOthersItemData,
    securityVisitors,
    securityGatepass,
    validateCode,
    securityCreateVisitor,
    listOfAllBlocks,
    listOfAllFlats
  }
}

export default {
  createApiClient
}
