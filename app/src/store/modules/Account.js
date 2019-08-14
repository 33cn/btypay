const state = {
  password: '',
  seed: '',//助记词
  accountMap: {},
  currentAccount: null,


  // string url
  mainNode: ['mainNode'],
  currentMain: "http://172.16.103.18:8801",

  // { string name, string coinName, string url }
  parallelNode: [],
  currentParallel: "http://172.16.103.24:8801",
}

const mutations = {
  UPDATE_PASSWORD(state, payload) {
    state.password = payload;
  },
  UPDATE_SEED(state, payload) {
    state.seed = payload;
  },
  UPDATE_ACCOUNTS (state, accountMap) {
    console.log(accountMap)
    state.accountMap = accountMap
  },
  UPDATE_CURRENTACCOUNT (state, currentAccount) {
    console.log(currentAccount)
    state.currentAccount = currentAccount
  },

  UPDATE_MAIN_NODE(state, payload) {
    state.mainNode = payload;
  },
  UPDATE_CURRENT_MAIN(state, payload) {
    state.currentMain = payload;
  },
  UPDATE_PARALLEL_NODE(state, payload) {
    state.parallelNode = payload
  },
  UPDATE_CURRENT_PARALLEL(state, payload) {
    state.currentParallel = payload
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
