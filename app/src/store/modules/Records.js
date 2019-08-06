const state = {
    loadingData:[],
  }
  
  const mutations = {
    LOADING_RECORDS(state,payload){
      state.loadingData = payload;
    }
  }
  
  export default {
    namespaced: true,
    state,
    mutations
  }
  