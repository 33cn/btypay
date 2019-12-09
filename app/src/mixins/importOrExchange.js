import { getChromeStorage,setChromeStorage } from "@/libs/chromeUtil.js";
import { decrypt,encrypt } from "@/libs/crypto.js";
import walletAPI from "@/mixins/walletAPI.js";
import {Arabia_To_zhDigit,zhDigit_To_Arabic} from '@/libs/digit.js'
export default {
    mixins:[walletAPI],
    methods: {
        saveSeed(seedString, password) {
            return new Promise((resolve,reject)=>{
                // const walletObj = this.createHDWallet(seedString)
                // 加密助记词 
                let ciphertext = encrypt(seedString, password)
                let obj = {
                    ciphertext,
                    password,
                    transferAddress:[]
                    // wallet : JSON.stringify(walletObj),
                    // account : walletObj.accountMap[0],
                    // isLogout:false
                }
                // 在AccountList中找出登出的钱包
                getChromeStorage("AccountList").then(res => {
                    let length = res.AccountList.length
                    console.log('=====res.AccountList==========')
                    console.log(res.AccountList)
                    console.log(length)
                    if (res.AccountList) {
                        let account = {}
                        for (let i = 0; i < length; i++) {
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
                        if(!account.password || !account.ciphertext){
                            account = { ...obj }
                        }
                        console.log(account)
                        if (!account.name) {
                            let name = ''
                            console.log('error：导入钱包找不到wallet')
                            for (let i = 0; i < length; i++){
                                let pA = JSON.parse(res.AccountList[i])
                                if(pA.name.indexOf('钱包') > -1){
                                    name = pA.name
                                }
                            }
                            if(name){
                                let num = zhDigit_To_Arabic(name.substr(2,name.length-2))+1
                                account.name = '钱包'+Arabia_To_zhDigit(num)
                                
                            }else{
                                account.name = "钱包一"
                            }
                        }
                        setChromeStorage("CreateingWallet", account).then(res => {
                            console.log('=====钱包账户存储成功=====')
                            const walletObj = this.createHDWallet(seedString)
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