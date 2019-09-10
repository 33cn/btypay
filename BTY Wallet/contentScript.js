document.addEventListener('DOMContentLoaded', function()
{
    console.log('BTY钱包插件运行...！');
    let installNode = document.createElement('div');
    document.body.appendChild(installNode)
    installNode.id = 'bty-chrome-extension-installed';
    installNode.style.display = 'none';
    // installNode.setAttribute('version', chrome.extension.getManifest().version); // 把版本号放到属性里
    installNode.innerText=JSON.stringify({'isINstalled': true}); // 把通信的data放到标签的html text里面
    // 创建一个事件，表示从Chrome发送消息给网页
    // var eventFromChrome = document.createEvent('Event');
    // eventFromChrome.initEvent('EventFromChrome', true, true);
    // 修改installNode的innerText把需要发送的消息内容放在里面
    // installNode.innerText = JSON.stringify({type: 'HELLO', msg: 'hello'});
    // 发出事件
    // installNode.dispatchEvent(eventFromChrome);
});
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
      case 'CREATE_NEW_WINDOW':
        chrome.runtime.sendMessage({
          action: 'create-new-window',
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
