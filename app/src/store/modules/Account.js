const state = {
  password: '11111111',
  seed: 'film,finger,voyage,during,alter,chat,sentence,hundred,connect,riot,doctor,cash,sing,nut,chat',//助记词
  accountMap: {},
  currentAccount: {
    address: "1NN5DQHp5goSLLFe6BhfL8DKALoCNuR9PT", //15KHkN7db2dUF5oWcvwTSSxg2uFqTHJH8J  
    base58PrivateKey: "xprvA3b4zNsRHPgvzSydbftV9acbtKhNui8P69E7B7UNmJCKfWJZ5biLtcnHC9gYWRdGufyhehMcFcaPYpCgNRYznSCBv1gxxGd3xUYAABibgxQ",
    hexPrivateKey: "910010376d40528ef943df150f419f28d311e5d90751031f9951f1b6cfb5f8d3",
    index: 0,
    name: "创世地址"
  },


  // string url
  mainNode: ['mainNode'],
  currentMain: "http://172.16.103.18:8801",

  // { string name, string coinName, string url }
  parallelNode: [],
  currentParallel: "http://172.16.103.24:8801",

  mainAsset: {
    amt: 1,
    price: 10
  },
  parallelAsset: {
    name: "GAME",
    amt: 1,
    price: 10
  },
}

const mutations = {
  UPDATE_PASSWORD(state, payload) {
    state.password = payload;
  },
  UPDATE_SEED(state, payload) {
    state.seed = payload;
  },
  UPDATE_ACCOUNTS(state, accountMap) {
    state.accountMap = accountMap
  },
  UPDATE_CURRENTACCOUNT(state, currentAccount) {
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
  },

  UPDATE_MAIN_ASSET(state, {amt, price}) {
    if(amt || amt == 0){
      state.mainAsset.amt = amt
    }
    if(price){
      state.mainAsset.price = price
    }
  },
  UPDATE_PARALLEL_ASSET(state, {name, amt, price}) {
    if(name){
      state.parallelAsset.name = name
    }
    if(amt || amt == 0){
      state.parallelAsset.amt = amt
    }
    if(price){
      state.parallelAsset.price = price
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
