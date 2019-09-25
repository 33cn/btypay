// script run in page-level
(function(){

  /**
   * Adds a postMessage listener for a specific message type
   *
   * @param {string} messageType - postMessage type to listen for
   * @param {Function} handler - event handler
   * @param {boolean} remove - removes this handler after being triggered
  */
  function onMessage (messageType, handler, remove) {
    window.addEventListener('message', function ({ data }) {
      console.log('99999')
      console.log(data)
      console.log(!data || data.type !== messageType)
      // if (!data || data.type !== messageType) { return }
      handler.apply(window, arguments)
      remove && window.removeEventListener('message', handler)
    })
  }
  function interfaceDefine(onMsg,postMessage,payload={}){
    return new Promise((resolve, reject) => {
      const timeTicket = setTimeout(() => {
        reject(new Error('Request Timeout'))
      }, 1 * 60 * 1000)
      const sendAnswerHandle = ({data: {payload}}) => {
        alert('完成了')
        clearTimeout(timeTicket)
        resolve(payload)
      }
      onMessage(onMsg, sendAnswerHandle, true)
      window.postMessage({ type: postMessage, payload }, '*')
    })
  }

  class Provider {

    constructor() {}
    
    /**
     * @description 比特元转账
     * @param {*} payload {to: 接收地址, amount: 金额, note: 备注}
     * @returns {Promise<any>}
     */
    sendToAddr(payload) {
      interfaceDefine('ANSWER_SEND_TO_ADDRESS','SEND_TO_ADDRESS',payload)
    }
    
    /**
     * @description 交易签名
     * @param {*} payload {tx: 未签名的交易字符串}
     * @returns {Promise<any>}
     */
    signTx(payload) {
      interfaceDefine('ANSWER_SIGN_TX','SIGN_TX',payload)
    }

    /**
     * @description 游戏币划转
     * @returns {Promise<any>}
     */
    parallelCoins2Dice(payload) {
      // interfaceDefine('ANSWER_PARA_COINS_DICE','PARA_COINS_DICE',payload)
      return new Promise((resolve, reject) => {
        let hash = {}
        const timeTicket = setTimeout(() => {
          reject(new Error('Request Timeout'))
        }, 1 * 60 * 1000)
        const sendAnswerHandle = ({data: {payload}}) => {
          console.log('完成了')
          clearTimeout(timeTicket)
          console.log('hash+'+hash)
          console.log(hash)
          resolve(hash)
        }
          window.addEventListener('message', function ({ data }) {
            console.log('99999')
            console.log(data)
            hash = data
            // console.log(!data || data.type !== 'ANSWER_PARA_COINS_DICE')
            if (!data || data.type !== 'ANSWER_PARA_COINS_DICE') { return }
            sendAnswerHandle.apply(window, arguments)
            window.removeEventListener('message', sendAnswerHandle)
          })
        // onMessage('ANSWER_PARA_COINS_DICE', sendAnswerHandle, true)
        window.postMessage({ type: 'PARA_COINS_DICE', payload }, '*')
      })
    }

    /**
     * @description 获取当前地址
     * @returns {Promise<any>}
     */
    getCurrentAccount() {
      // interfaceDefine('ANSWER_GET_CURRENT_ACCOUNT','GET_CURRENT_ACCOUNT',payload)
      return new Promise((resolve, reject) => {
        const timeTicket = setTimeout(() => {
          reject(new Error('Request Timeout'))
        }, 1 * 60 * 1000)
        const signAnswerHandle = ({data: {payload}}) => {
          clearTimeout(timeTicket)
          resolve(payload)
        }
        onMessage('ANSWER_GET_CURRENT_ACCOUNT', signAnswerHandle, true)
        window.postMessage({ type: 'GET_CURRENT_ACCOUNT', payload: {} }, '*')
      })
    }

    /**
     * @description 获取余额
     * @returns {Promise<any>}
     */
    queryGameBalance(){
      return new Promise((resolve,reject)=>{
        const timeTicket = setTimeout(() => {
          reject(new Error('Request Timeout'))
        }, 1 * 60 * 1000)
        const signAnswerHandle = ({data: {payload}}) => {
          clearTimeout(timeTicket)
          resolve(payload)
        }
        onMessage('ANSWER_QUERY_GAME_BALANCE', signAnswerHandle, true)
        window.postMessage({ type: 'QUERY_GAME_BALANCE', payload: {} }, '*')
      })
    }

    /**
     * @description 获取平行链节点列表
     * @returns {Promise<any>}
     */
    queryParallelNode(){
      return new Promise((resolve,reject)=>{
        const timeTicket = setTimeout(() => {
          reject(new Error('Request Timeout'))
        }, 1 * 60 * 1000)
        const signAnswerHandle = ({data: {payload}}) => {
          clearTimeout(timeTicket)
          resolve(payload)
        }
        onMessage('ANSWER_QUERY_PARALLEL_NODE', signAnswerHandle, true)
        window.postMessage({ type: 'QUERY_PARALLEL_NODE', payload: {} }, '*')
      })
    }

    /**
     * @description 获取当前主链节点
     * @returns {Promise<any>}
     */
    queryCurrentMainNode(){
      return new Promise((resolve,reject)=>{
        const timeTicket = setTimeout(() => {
          reject(new Error('Request Timeout'))
        }, 1 * 60 * 1000)
        const signAnswerHandle = ({data: {payload}}) => {
          clearTimeout(timeTicket)
          resolve(payload)
        }
        onMessage('ANSWER_QUERY_CURRENT_MAIN_NODE', signAnswerHandle, true)
        window.postMessage({ type: 'QUERY_CURRENT_MAIN_NODE', payload: {} }, '*')
      })
    }
    // 测试
    createNewWindow(){
      return new Promise((resolve,reject)=>{
        const timeTicket = setTimeout(() => {
          reject(new Error('Request Timeout'))
        }, 1 * 60 * 1000)
        const signAnswerHandle = ({data: {payload}}) => {
          clearTimeout(timeTicket)
          resolve(payload)
        }
        onMessage('ANSWER_CREATE_NEW_WINDOW', signAnswerHandle, true)
        window.postMessage({ type: 'CREATE_NEW_WINDOW', payload: {} }, '*')
      })
    }
  }

  window.btyExtensionProvider = new Provider()
})()