import { eventBus } from '@/libs/eventBus'
import { TransactionsType } from "@/libs/bitcoinAmount.js";

export default {
  data(){
    return{
      TX_FLAG: {
        ALL: { label: "全部", val: 0, name: "All" },
        SEND: { label: "转账", val: 1, name: "Transfer" },
        RECV: { label: "收款", val: 2, name: "Receipt" },
        EXC: { label: "兑换", val: 3, name: "Convert", hideInMain: true },
      },
      TX_DIRECTION: {
        DESC: 0,
        ASC: 1
      }
    }
  },
  methods: {
    castFlag2Typety(flag){
      switch(flag){
        case this.TX_FLAG.SEND.val:
          return TransactionsType.SendToAddress
        case this.TX_FLAG.RECV.val:
          return TransactionsType.RecvWithAddress
        case this.TX_FLAG.EXC.val: 
          return TransactionsType
        default: 
          return -1
      }
    },

    createRawTradeSellMarketTx(buyID, boardlotCnt, fee, url) {
      return this.$chain33Sdk.createRawTradeSellMarketTx(buyID, boardlotCnt, fee, url)
    },
    createRawTradeBuyMarketTx(sellId, boardlotCnt, fee, url){
      return this.$chain33Sdk.createRawTradeBuyTx(sellId, boardlotCnt, fee, url)
    },
    // 生成发布事件的交易（未签名）
    createTransaction(params, url) {
      return this.$chain33Sdk.createTransaction(params, url)
    },
    // 构造交易
    createRawTransaction(params, url) {
      return this.$chain33Sdk.createRawTransaction(params, url)
    },
    // 发送交易
    sendTransaction(signedTx, url) {
      return this.$chain33Sdk.sendTransaction(signedTx, url)
    },

    

    getAddrBalance(addr, execer, url, asset_exec, asset_symbol) {
      return this.$chain33Sdk.getAddrBalance([addr], execer, url, asset_exec, asset_symbol)
    },



    /*  根据地址获取交易信息
     *  addr      地址
     *  flag      0：addr 的所有交易；1：当 addr 为发送方时的交易；2：当 addr 为接收方时的交易
     *  count     数量
     *  direction 0：向后获取 1：向后获取
     *  height    交易所在的block高度，-1：表示从最新的开始向后取；大于等于0的值，从具体的高度+具体index开始取
     *  index     交易所在block中的索引，取值0--100000} */
    getAddrTx(addr, flag, count, direction, height, index, url) {
      if (url) {
        eventBus.$emit('node-change', url)
      }
      return this.$chain33Sdk.getAddrTx({
        addr,
        count,
        direction,
        height,
        index,
        flag,
      }, url)
    },
    // 构造交易组
    CreateRawTxGroup(txs){
      return this.$chain33Sdk.createRawTxGroup(txs)
    },
    // 获取最新的区块头
    getLastHeader(url){
      return this.$chain33Sdk.getLastHeader(url)
    }
  }
}
