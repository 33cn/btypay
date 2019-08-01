const cryptoJS = require('crypto-js')

export function encrypt(msg, pwd) {
  return cryptoJS.AES.encrypt(msg, pwd).toString()
}

export function decrypt(ciphertext, pwd) {
  let returnStr = ''
  const bytes = cryptoJS.AES.decrypt(ciphertext, pwd)
  try {
    returnStr = bytes.toString(cryptoJS.enc.Utf8)
  } catch(error) {
    console.error(error)
    returnStr = ''
  }

  return returnStr
  
}
