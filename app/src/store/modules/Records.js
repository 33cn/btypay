const state = {
    loadingData:[],
    assetType:''
  }
  
  const mutations = {
    LOADING_RECORDS(state,payload){
      state.loadingData = payload;
    },
    ASSET_TYPE(state,payload){
      state.assetType = payload;
    }
  }
  
  export default {
    namespaced: true,
    state,
    mutations
  }
  