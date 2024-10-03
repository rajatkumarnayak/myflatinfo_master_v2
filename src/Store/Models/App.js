import { action, thunk } from 'easy-peasy'
import check from 'check-types'

import { ApiService, StoreService } from '../../Store'
import { STATUS, APP_STATE } from '../../Constants'
import BaseModel from './Base'

const initialState = {
  appstate: APP_STATE.PUBLIC,
  language: 1,
  introData: [],
  buildingList: [],
  building: null,
  flatList: [],
  flat: null,
  isFlatSelectorModalVisible: false
}

const checkAppVersion = thunk(async (actions, payload, { injections }) => {
  const { api } = injections
  actions.updateStatus(STATUS.FETCHING)
  // let response = await api.checkAppVersion();
  // if (response.ok) {
  // let version = 9;
  // actions.setVersion(version);
  // }
  actions.updateStatus(STATUS.SUCCESS)
})

const fetchIntroData = thunk(async (actions, payload, { dispatch }) => {
  actions.updateStatus(STATUS.FETCHING)
  const response = await ApiService.fetchIntroData(payload)
  actions.setIntroData(response.data)
})

const loadBuildingList = thunk(async (actions, payload, { dispatch }) => {
  actions.updateStatus(STATUS.FETCHING)
  const response = await ApiService.fetchBuildingListData()
  console.log(response, "building list initial >>>>>");
  actions.saveBuildingList(response.data)
})

const loadFlatList = thunk(async (actions, payload, { dispatch }) => {
  actions.updateStatus(STATUS.FETCHING)
  
  const response = await ApiService.fetchFlatListData()
  console.log(response ,"response fetchFlatListData");
  actions.saveFlatList(response.data)
  response.data.map((item,index)=>{
    if(item.IsOwner == true){
      actions.selectFlat(response.data[index])
    }
  })
  // actions.selectFlat(response.data[0])
})

const AppModel = {
  ...BaseModel(),
  ...initialState,
  checkAppVersion,
  loadBuildingList,
  loadFlatList,
  fetchIntroData,
  setVersion: action((state, version) => {
    state.version = version
  }),
  setIntroData: action((state, payload) => {
    state.introData = payload
  }),
  saveBuildingList: action((state, payload) => {
    state.buildingList = payload
  }),
  saveFlatList: action((state, payload) => {
    if (check.array(payload)) {
      state.flatList = payload
    } else {
      state.flatList = initialState.flatList
    }
  }),
  selectBuilding: action((state, payload) => {
    state.building = payload
  }),
  selectFlat: action((state, payload) => {
    state.flat = payload
  })
}

export default AppModel
