import { eventBus } from '@/libs/eventBus'
export default {
  data(){
    return{
      TX_FLAG: {
        ALL: 0,
        SEND: 1,
        RECV: 2
      },
      TX_DIRECTION: {
        REAR: 0,
        FRONT: 1
      }
    }
  },
  methods: {

    createRawTradeSellMarketTx(buyID, boardlotCnt, fee) {
      return this.$chain33Sdk.createRawTradeSellMarketTx(buyID, boardlotCnt, fee)
    },
    // 生成发布事件的交易（未签名）
    createTransaction(execer, actionName, payload) {
      return this.$chain33Sdk.createTransaction({ execer, actionName, payload })
    },
    createRawTransactionWithExec(to, amount, fee, execName, isWithdraw) {
      return this.$chain33Sdk.createTransaction({ to, amount, fee, execName, isWithdraw })
    },
    // 构造交易
    createRawTransaction(to, amount, fee, note) {
      return this.$chain33Sdk.createRawTransaction({ to, amount, fee, note })
    },
    // 发送交易
    sendTransation(signedTx) {
      return this.$chain33Sdk.sendTransaction(signedTx)
    },

    

    getAddrBalance(addr, execer, url) {
      return this.$chain33Sdk.getAddrBalance([addr], execer, url)
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
    }

    // queryTransaction(hash, url){
    //   if (url) {
    //     eventBus.$emit('node-change', url)
    //   }
    //   return this.$chain33Sdk.queryTransaction(hash, url)
    // }
  }
}
