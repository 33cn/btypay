const state = {
  // loadingData: [],
  recordData: [],
  recordDetail:{},
  assetType: ''
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
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
