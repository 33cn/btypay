const cryptoJS = require('crypto-js')

export function encrypt(msg, pwd) {
  // console.log(msg)
  // console.log(pwd)
  let encJson = cryptoJS.AES.encrypt(msg, pwd).toString()
  return cryptoJS.enc.Base64.stringify(cryptoJS.enc.Utf8.parse(encJson));
  // return cryptoJS.AES.encrypt(msg, pwd).toString()
}

export function decrypt(ciphertext, pwd) {
  let decData = cryptoJS.enc.Base64.parse(ciphertext).toString(cryptoJS.enc.Utf8);
  console.log(decData)
  let returnStr = ''
  console.log(ciphertext)
  console.log(pwd)
  // const bytes = cryptoJS.AES.decrypt(JSON.stringify(ciphertext), pwd)
  const bytes = cryptoJS.AES.decrypt(decData, pwd)
  console.log(bytes)
  try {
    returnStr = bytes.toString(cryptoJS.enc.Utf8)
  } catch(error) {
    console.error(error)
    returnStr = ''
  }

  return returnStr
  
}
