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
      if (!data || data.type !== messageType) { return }
      remove && window.removeEventListener('message', handler)
      handler.apply(window, arguments)
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
      return new Promise((resolve, reject) => {
        const timeTicket = setTimeout(() => {
          reject(new Error('Request Timeout'))
        }, 1 * 60 * 1000)
        const sendAnswerHandle = ({data: {payload}}) => {
          clearTimeout(timeTicket)
          resolve(payload)
        }
        onMessage('ANSWER_SEND_TO_ADDRESS', sendAnswerHandle, true)
        window.postMessage({ type: 'SEND_TO_ADDRESS', payload }, '*')
      })
    }

    /**
     * @description 交易签名
     * @param {*} payload {tx: 未签名的交易字符串}
     * @returns {Promise<any>}
     */
    signTx(payload) {
      return new Promise((resolve, reject) => {
        const timeTicket = setTimeout(() => {
          reject(new Error('Request Timeout'))
        }, 1 * 60 * 1000)
        const signAnswerHandle = ({data: {payload}}) => {
          clearTimeout(timeTicket)
          resolve(payload)
        }
        onMessage('ANSWER_SIGN_TX', signAnswerHandle, true)
        window.postMessage({ type: 'SIGN_TX', payload }, '*')
      })
    }

    /**
     * @description 获取当前地址
     * @returns {Promise<any>}
     */
    getCurrentAccount() {
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
  }

  window.btyExtensionProvider = new Provider()
})()