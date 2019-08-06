export default {
  methods: {

    createRawTradeSellMarketTx(buyID, boardlotCnt, fee){
      return this.$chain33Sdk.createRawTradeSellMarketTx(buyID, boardlotCnt, fee)
    },
    createTransaction(execer, actionName, payload){
      return this.$chain33Sdk.createTransaction({execer, actionName, payload})
    },
    createRawTransactionWithExec(to, amount, fee, execName, isWithdraw){
      return this.$chain33Sdk.createTransaction({to, amount, fee, execName, isWithdraw})
    },

    createRawTransaction(to, amount, fee, note) {
      return this.$chain33Sdk.createRawTransaction({to, amount, fee, note})
    },
    sendTransation(signedTx) {
      return this.$chain33Sdk.sendTransaction(signedTx)
    },
    getAddrBalance(addr, execer) {
      return this.$chain33Sdk.getAddrBalance([addr], execer)
    },
    getAddrTx(addr, count, direction, height, index) {
      return this.$chain33Sdk.getAddrTx({
        addr,
        count,
        direction,
        height,
        index,
        flag: 0
      })
    }
  }
}
