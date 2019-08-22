const state = {
  password: '11111111',
  seed: 'film finger voyage during alter chat sentence hundred connect riot doctor cash sing nut chat',//助记词
  accountMap: {},
  currentAccount: {
    address: "1GUhbeySSNywQcGcsjhPPXMX7iRZ6P6ovb", //15KHkN7db2dUF5oWcvwTSSxg2uFqTHJH8J  // 1NN5DQHp5goSLLFe6BhfL8DKALoCNuR9PT
    // address: "1NN5DQHp5goSLLFe6BhfL8DKALoCNuR9PT",
    base58PrivateKey: "xprvA3b4zNsRHPgvzSydbftV9acbtKhNui8P69E7B7UNmJCKfWJZ5biLtcnHC9gYWRdGufyhehMcFcaPYpCgNRYznSCBv1gxxGd3xUYAABibgxQ",
    // hexPrivateKey: "910010376d40528ef943df150f419f28d311e5d90751031f9951f1b6cfb5f8d3",
    hexPrivateKey: '0x76b33cfa093226848e1e979c649778b4a24e040a97bb099007f73afb54b4c2fb',
    index: 0,
    name: "创世地址"
  },


  mainAsset: {
    amt: 1,
    price: 10
  },
  parallelAsset: {
    name: "GAME",
    amt: 1,
    price: 10
  },


  // {string url, num height, num index}
  mainNode: [{ url: 'http://172.16.103.18:8801', height: 0, index: 0, coin: "BTY" }],
  // { string url, num height, num index }
  currentMain: { url: 'http://172.16.103.18:8801', height: 0, index: 0, coin: "BTY" },

  // { string name, string coinName, string url, num height, num index }
  parallelNode: [{ name: '金比特', coin: "GBT", url: "http://172.16.103.24:8801" }],
  // { string name, string coinName, string url, num height, num index }
  currentParallel: { url: "http://172.16.103.24:8801" },

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
    state.mainNode.push(payload);
  },
  UPDATE_CURRENT_MAIN(state, {url, height, index, tableName}) {
    url && (state.currentMain.url = url)
    height && (state.currentMain.height = height)
    index && (state.currentMain.index = index)
    tableName && (state.currentMain.tableName = tableName)
  },
  UPDATE_PARALLEL_NODE(state, payload) {
    state.parallelNode.push(payload)
  },
  UPDATE_CURRENT_PARALLEL(state, {url, height, index, tableName}) {
    url && (state.currentMain.url = url)
    height && (state.currentMain.height = height)
    index && (state.currentMain.index = index)
    tableName && (state.currentMain.tableName = tableName)
  },

  UPDATE_MAIN_ASSET(state, { amt, price }) {
    if (amt || amt == 0) {
      state.mainAsset.amt = amt
    }
    if (price) {
      state.mainAsset.price = price
    }
  },
  UPDATE_PARALLEL_ASSET(state, { name, amt, price }) {
    if (name) {
      state.parallelAsset.name = name
    }
    if (amt || amt == 0) {
      state.parallelAsset.amt = amt
    }
    if (price) {
      state.parallelAsset.price = price
    }
  },


}

export default {
  namespaced: true,
  state,
  mutations
}
