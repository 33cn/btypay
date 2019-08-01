export default {
  methods: {
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
