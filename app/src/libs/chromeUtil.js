export function getChromeStorage(keys){
    return new Promise(resolve => {
      window.chrome.storage.local.get(keys, (result) => {
        resolve(result)
      })
    })
}

export function setChromeStorage(key, value){
    return new Promise(resolve => {
        window.chrome.storage.local.set({ [key]: value }, () => {
          resolve('success')
        })
      })
}