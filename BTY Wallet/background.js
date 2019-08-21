chrome.runtime.onInstalled.addListener(()=>{
  // // alert('BTY钱包插件安装好啦！')
  // console.log('hello')
  chrome.storage.local.set({['key']: 'fanrui'}, () => {
    // console.log('value')
  })
  chrome.storage.local.get('key',(val)=>{
    // console.log(val)
  })
  // console.log(Pupop)
});

chrome.runtime.onMessage.addListener(({action = '', payload}, sender) => {

  switch(action) {
    case 'get-current-account':
      if (isWalletUnlock()) {
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
        payload.actionID = action
        createNewWindow('sign', payload)
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
    case 'reply-background-sign-tx':
      sendMessage({
        action: 'answer-sign-tx',
        payload,
      })
      break;
    default:
      
  }
  return true;
})

function createNewWindow(route, payload, width = 400, height = 600) {
  let baseURL = `${window.chrome.runtime.getURL('/dist/index.html')}#/${route}`
  let url = spliceURL(baseURL, payload)
  chrome.windows.create({url, width, height, type: 'popup'})
};

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
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, message)
    })
  })
}

function isWalletUnlock() {
  return Boolean(window.myChain33WalletInstance)
}
