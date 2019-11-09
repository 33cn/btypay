// const sayHello = require('./libs/demo.js')
chrome.runtime.onInstalled.addListener(()=>{
  chrome.notifications.create(null, {
    type: 'basic',
    iconUrl: 'icons/logo.png',
    title: 'BTY钱包插件',
    message: 'BTY钱包插件安装成功，快去使用吧！'
  });
});
// console.log(printxx())
// sayHello()
var tabId = ''
var txType = '';
var txObj = {};
var voteHash = 'hash'
var signedTx = ''
var windowId  = null;
chrome.runtime.onMessage.addListener(({action = '', payload}, sender) => {
  tabId = sender.tab.id
  // console.log(sender)
  console.log('tabid+'+tabId)
  switch(action) {
    case 'get-current-account':
      if (isWalletUnlock()) {
        // console.log('-get-current-account')
        // console.log(window.currentAccount)
        if(window.currentAccount&&window.currentAccount.name&&window.currentAccount.address){
          sendMessage({
            action: 'answer-get-current-account',
            payload: {
              error: null,
              result: {
                account: {
                  name: window.currentAccount.name,
                  address: window.currentAccount.address,
                }
              }
            },
          })
        }else{
          sendMessage({
            action: 'answer-get-current-account',
            payload: {
              error: 'wallet is not unlock',
              result: null
            },
          })
        }
      } else {
        sendMessage({
          action: 'answer-get-current-account',
          payload: {
            error: 'walletIsLocked',
            result: null
          },
        })
      }
      break;
    case 'send-to-address':
      if (isWalletUnlock()) {
        payload.actionID = action
        createNewWindow('send', payload)
      } else {
        sendMessage({
          action: 'answer-send-to-address',
          payload: {
            error: 'walletIsLocked',
            result: null
          },
        })
      }
      break;
    case 'reply-background-send-to-address':
      sendMessage({
        action: 'answer-send-to-address',
        payload,
      })
      break;
    case 'sign-tx':
      if (isWalletUnlock()) {
        txType = 'sign-tx'
        payload.actionID = action
        txObj = payload;
        // console.log(payload)
        createNewWindow('outExtensionPage', payload)
        // setTimeout(() => {
        //   isSignTx()
        // }, 0);
      } else {
        sendMessage({
          action: 'answer-sign-tx',
          payload: {
            error: 'walletIsLocked',
            result: null
          },
        })
      }
      break;
    case 'send-tx':
      if (isWalletUnlock()) {
        txType = 'send-tx'
        payload.actionID = action
        txObj = payload;
        // console.log(payload)
        createNewWindow('outExtensionPage', payload)
        // setTimeout(() => {
        //   isSignTx()
        // }, 0);
      } else {
        sendMessage({
          action: 'answer-send-tx',
          payload: {
            error: 'walletIsLocked',
            result: null
          },
        })
      }
      break;
    case 'create-tx':
      if (isWalletUnlock()) {
        txType = 'create-tx'
        payload.actionID = action
        txObj = payload;
        // console.log(payload)
        createNewWindow('outExtensionPage', payload)
        // setTimeout(() => {
        //   isSignTx()
        // }, 0);
      } else {
        sendMessage({
          action: 'answer-create-tx',
          payload: {
            error: 'walletIsLocked',
            result: null
          },
        })
      }
      break;
    case 'para-coins-dice':
      if (isWalletUnlock()) {
        txType = 'para-coins-dice'
        payload.actionID = action
        txObj = payload;
        // console.log(payload)
        createNewWindow('outExtensionPage', payload)
        // setTimeout(() => {
        //   isGetVoteHash()
        // }, 0);
      } else {
        sendMessage({
          action: 'answer-para-coins-dice',
          payload: {
            error: 'walletIsLocked',
            result: null
          },
        })
      }
      break;
    case 'bty-main-parallel':
      if (isWalletUnlock()) {
        txType = 'bty-main-parallel'
        payload.actionID = action
        txObj = payload;
        // console.log(payload)
        createNewWindow('outExtensionPage', payload)
        // setTimeout(() => {
        //   isGetVoteHash()
        // }, 0);
      } else {
        sendMessage({
          action: 'answer-bty-main-parallel',
          payload: {
            error: 'walletIsLocked',
            result: null
          },
        })
      }
      break;
    case 'bty-parallel-main':
      if (isWalletUnlock()) {
        txType = 'bty-parallel-main'
        payload.actionID = action
        txObj = payload;
        // console.log(payload)
        createNewWindow('outExtensionPage', payload)
        // setTimeout(() => {
        //   isGetVoteHash()
        // }, 0);
      } else {
        sendMessage({
          action: 'answer-bty-parallel-main',
          payload: {
            error: 'walletIsLocked',
            result: null
          },
        })
      }
      break;
    case 'ccny-main-parallel':
      if (isWalletUnlock()) {
        txType = 'ccny-main-parallel'
        payload.actionID = action
        txObj = payload;
        // console.log(payload)
        createNewWindow('outExtensionPage', payload)
        // setTimeout(() => {
        //   isGetVoteHash()
        // }, 0);
      } else {
        sendMessage({
          action: 'answer-ccny-main-parallel',
          payload: {
            error: 'walletIsLocked',
            result: null
          },
        })
      }
      break;
    case 'ccny-parallel-main':
      if (isWalletUnlock()) {
        txType = 'ccny-parallel-main'
        payload.actionID = action
        txObj = payload;
        // console.log(payload)
        createNewWindow('outExtensionPage', payload)
        // setTimeout(() => {
        //   isGetVoteHash()
        // }, 0);
      } else {
        sendMessage({
          action: 'answer-ccny-parallel-main',
          payload: {
            error: 'walletIsLocked',
            result: null
          },
        })
      }
      break;
    case 'reply-background-sign-tx':
      // console.log('reply-background-sign-tx')
      // console.log(payload)
      sendMessage({
        action: 'answer-sign-tx',
        payload:{
          error:null,
          signedTx:signedTx || payload.signedTx
        }
      })
      break;
    case 'reply-background-send-tx':
      sendMessage({
        action: 'answer-send-tx',
        payload:{
          error:null,
          result:payload.hash
        }
      })
      break;
    case 'reply-background-create-tx':
      // console.log('reply-background-sign-tx')
      // console.log(payload)
      sendMessage({
        action: 'answer-create-tx',
        payload:{
          error:null,
          result:payload.hash
        }
      })
      break;
    case 'reply-background-para-coins-dice':
      // console.log('reply-background-para-coins-dice')
      // console.log(payload)
      sendMessage({
        action: 'answer-para-coins-dice',
        payload:{
          error:null,
          result:voteHash || payload.voteHash
        }
      })
      setTimeout(() => {
        // closeWindow(win.windowId)
      }, 300);
      break;
    case 'reply-background-bty-main-parallel':
      console.log('reply-background-bty-main-parallel')
      console.log(payload)
      sendMessage({
        action: 'answer-bty-main-parallel',
        payload:{
          error:null,
          result:payload.hash
        }
      })
      break
    case 'reply-background-bty-parallel-main':
      sendMessage({
        action: 'answer-bty-parallel-main',
        payload:{
          error:null,
          result:payload.hash
        }
      })
      break
    case 'reply-background-ccny-main-parallel':
      sendMessage({
        action: 'answer-ccny-main-parallel',
        payload:{
          error:null,
          result:payload.hash
        }
      })
      break
    case 'reply-background-ccny-parallel-main':
      sendMessage({
        action: 'answer-ccny-parallel-main',
        payload:{
          error:null,
          result:payload.hash
        }
      })
      break
    case 'unlock-wallet':
      if(isWalletUnlock()){
        createNewWindow('WalletIndex', payload)
      }else{
        createNewWindow('', payload)
      }
      break;
    case 'query-parallel-node':
      if (isWalletUnlock()) {
        window.chrome.storage.local.get('parallelNodeList', (result) => {
          sendMessage({
            action: 'answer-query-parallel-node',
            payload: {
              error: null,
              result
            },
          })
        })
      } else {
        sendMessage({
          action: 'answer-query-parallel-node',
          payload: {
            error: 'walletIsLocked',
            result: null
          },
        })
      }
      break
    case 'query-current-main-node':
      if (isWalletUnlock()) {
        window.chrome.storage.local.get('mainNode', (result) => {
          sendMessage({
            action: 'answer-query-current-main-node',
            payload: {
              error: null,
              result:result.mainNode
            },
          })
        })
      } else {
        sendMessage({
          action: 'answer-query-current-main-node',
          payload: {
            error: 'walletIsLocked',
            result: null
          },
        })
      }
      
      break
    default:
      
  }
  return true;
})

function createNewWindow(route, payload, width = 416, height = 636) {
  if(window.navigator.userAgent.indexOf('Windows') > -1){
    width = 416
    height = 636
  }else{
    width = 400
    height = 620
  }
  let baseURL = `${window.chrome.runtime.getURL('/dist/index.html')}#/${route}`
  let url = spliceURL(baseURL, payload)
  chrome.windows.create({url, width, height, type: 'popup'},function(res){
    // console.log('chrome.windows.create')
    // console.log(res)
    windowId = res.id
    // setTimeout(() => {
    //   closeWindow(res.id)
    // }, 15000);
  })
};
function closeWindow(id){
  chrome.windows.remove(id, function(res){
    // console.log('chrome.windows.remove')
    // console.log(res)
  })
}

function* entries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
};

function spliceURL(url, params) {
  let queryArray = []
  for(let [key, val] of entries(params)) {
    queryArray.push(`${key}=${val}`)
  }
  return `${url}?${queryArray.join('&')}`
}

function sendMessage (message, query = {}) {
  chrome.tabs.query(query, tabs => {
    // console.log(tabs)
    // chrome.tabs.sendMessage(tabId, message)
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, message)
    })
  })
}

function isWalletUnlock() {
  return Boolean(window.myChain33WalletInstance)
}

// function isGetVoteHash(){
//   console.log(voteHash)
//   if(voteHash){
//     sendMessage({
//       action: 'answer-para-coins-dice',
//       payload: {
//         error: null,
//         result: voteHash
//       },
//     })
//   }else{
//     setTimeout(() => {
//       isGetVoteHash()
//     }, 100);
//   }
// }
// function isSignTx(){
//   console.log(signTx)
//   if(voteHash){
//     sendMessage({
//       action: 'answer-sign-tx',
//       payload: {
//         error: null,
//         result: signTx
//       },
//     })
//   }else{
//     setTimeout(() => {
//       isSignTx()
//     }, 100);
//   }
// }