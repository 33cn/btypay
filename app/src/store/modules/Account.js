const state = {
  password:'',
  seed:'',//助记词
  accountMap: {},
  currentAccount: null,
}

const mutations = {
  UPDATE_PASSWORD(state,payload){
    state.password = payload;
  },
  UPDATE_SEED(state,payload){
    state.seed = payload;
  },
  UPDATE_ACCOUNTS (state, accountMap) {
    console.log(accountMap)
    state.accountMap = accountMap
  },
  UPDATE_CURRENTACCOUNT (state, currentAccount) {
    console.log(currentAccount)
    state.currentAccount = currentAccount
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
