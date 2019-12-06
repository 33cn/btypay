import { getChromeStorage,setChromeStorage } from "@/libs/chromeUtil.js";
import { decrypt,encrypt } from "@/libs/crypto.js";
import walletAPI from "@/mixins/walletAPI.js";
export default {
    mixins:[walletAPI],
    methods: {
        saveSeed(seedString, password) {
            return new Promise((resolve,reject)=>{
                const walletObj = this.createHDWallet(seedString)
                // 加密助记词 
                let ciphertext = encrypt(seedString, password)
                let obj = {
                    ciphertext,
                    password,
                    // wallet : JSON.stringify(walletObj),
                    // account : walletObj.accountMap[0],
                    // isLogout:false
                }
                // 在AccountList中找出登出的钱包
                getChromeStorage("AccountList").then(res => {
                    console.log('=====res.AccountList==========')
                    console.log(res.AccountList)
                    console.log(res.AccountList.length)
                    console.log(JSON.parse(res.AccountList[0]))
                    // console.log(JSON.parse(res.AccountList[1]))
                    if (res.AccountList) {
                        let account = {}
                        for (let i = 0; i < res.AccountList.length; i++) {
                            let pA = JSON.parse(res.AccountList[i])
                            let mnemonic = decrypt(pA.ciphertext, pA.password);
                            if (seedString == mnemonic) {
                                console.log('存在该钱包')
                                console.log(pA)
                                // account = {...pA}
                                account = { ...pA, ...obj }
                                break
                            }
                        }
                        console.log(account)
                        if (!account.name) {
                            alert('error：导入钱包找不到wallet')
                            return
                        }
                        setChromeStorage("CreateingWallet", account).then(res => {
                            console.log('=====钱包账户存储成功=====')
                            this.newAccount(account.name, 'import')
                            resolve('success')
                        })
                    } else {
                        this.$message.error("无AccountList3");
                        reject('error')
                    }
                })
                // return walletObj
            })
        },
    }
}