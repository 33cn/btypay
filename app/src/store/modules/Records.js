const state = {
  // loadingData: [],
  recordData: [],
  recordDetail:{},
  assetType: 'game',
  pageIsClose:true
}

const mutations = {
  LOADING_RECORDS(state, payload) {
    // state.loadingData = payload;
    state.recordData = state.recordData.concat(payload)
  },
  UPDATE_RECORDS(state, payload){
    state.recordData = payload
  },
  ASSET_TYPE(state, payload) {
    state.assetType = payload;
  },
  RECORD_DETAIL(state,payload){
    state.recordDetail = payload;
  },
  PAGE_IS_CLOSE(state,payload){
    state.pageIsClose = payload;
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
