import {eventBus} from '@/libs/eventBus'
export default {
  methods: {

    createRawTradeSellMarketTx(buyID, boardlotCnt, fee){
      return this.$chain33Sdk.createRawTradeSellMarketTx(buyID, boardlotCnt, fee)
    },
    // 生成发布事件的交易（未签名）
    createTransaction(execer, actionName, payload){
      return this.$chain33Sdk.createTransaction({execer, actionName, payload})
    },
    createRawTransactionWithExec(to, amount, fee, execName, isWithdraw){
      return this.$chain33Sdk.createTransaction({to, amount, fee, execName, isWithdraw})
    },
    // 构造交易
    createRawTransaction(to, amount, fee, note) {
      return this.$chain33Sdk.createRawTransaction({to, amount, fee, note})
    },
    // 发送交易
    sendTransation(signedTx) {
      return this.$chain33Sdk.sendTransaction(signedTx)
    },
    // getAddrBalance
    getAddrBalance(addr, execer) {
      return this.$chain33Sdk.getAddrBalance([addr], execer)
    },
    // 根据地址获取交易信息
    getAddrTx(addr, count, direction, height, index, url) {
      if(url){
        eventBus.$emit('node-change', url)
      }
      return this.$chain33Sdk.getAddrTx({
        addr,
        count,
        direction,
        height,
        index,
        flag: 0,
      },url)
    }
  }
}
