// script run in content script
const inpageURL = chrome.runtime.getURL('inpage.js')

injectScript(inpageURL)
listenForProviderRequest()

function injectScript (url) {
  try {
    const container = document.head || document.documentElement
    const scriptTag = document.createElement('script')
    scriptTag.setAttribute('async', false)
    scriptTag.src = url
    container.insertBefore(scriptTag, container.children[0])
    container.removeChild(scriptTag)
  } catch (e) {
    console.error('btyExtensionProvider script injection failed', e)
  }
}

function listenForProviderRequest () {
  // listen message from page-level
  window.addEventListener('message', ({ source, data }) => {
    if (source !== window || !data || !data.type) { return }
    switch (data.type) {
      case 'SEND_TO_ADDRESS':
        chrome.runtime.sendMessage({
          action: 'send-to-address',
          payload: data.payload,
        })
        break
      case 'SIGN_TX':
        chrome.runtime.sendMessage({
          action: 'sign-tx',
          payload: data.payload,
        })
        break
      case 'GET_CURRENT_ACCOUNT':
        chrome.runtime.sendMessage({
          action: 'get-current-account',
          payload: data.payload,
        })
        break
    }
  })
  // listen message from background page
  chrome.runtime.onMessage.addListener(({ action = '', payload }) => {
    switch (action) {
      case 'answer-send-to-address':
        window.postMessage({ type: 'ANSWER_SEND_TO_ADDRESS', payload }, '*')
        break
      case 'answer-sign-tx':
        window.postMessage({ type: 'ANSWER_SIGN_TX', payload }, '*')
        break
      case 'answer-get-current-account':
        window.postMessage({ type: 'ANSWER_GET_CURRENT_ACCOUNT', payload }, '*')
        break
    }
  })
}
