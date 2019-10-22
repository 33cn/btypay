import chain33API from '@/mixins/chain33API'
import { seed, sign } from '@33cn/wallet-base'
import { createNamespacedHelpers } from "vuex";
import { DBHelper } from "@/libs/dbHelper"
import { TransactionsListEntry, formatTxType } from "@/libs/bitcoinAmount";
import { getChromeStorage, setChromeStorage } from "@/libs/chromeUtil"

const { mapState } = createNamespacedHelpers("Account");

let isDev = process.env.NODE_ENV === 'development'

const DB_NAME = "WalletDB"
const TABLE_NAME = "txs"
const TABLE_DATA = {
  keyPath: {
    keyPath: 'id',
    autoIncrement: true
  },
  index: [
    { name: "symbol", key: "symbol", payload: { unique: false } },
    { name: "symbol_typeTy", key: ['symbol', 'typeTy'], payload: { unique: false } }
  ]
}
const dbHelper = new DBHelper(DB_NAME, TABLE_NAME, TABLE_DATA)

function getBackgroundPage() {
  return new Promise((resolve) => {
    if (isDev) {
      resolve(window)
    } else {
      window.chrome.runtime.getBackgroundPage(win => {
        resolve(win)
      })
    }
  })
}

export default {
  mixins: [chain33API],
  computed: {
    ...mapState([
      "currentAccount",
      "currentMain",
      "currentParallel",
    ])
  },
  methods: {
    /* 账户相关 -- start */
    newMnemonic(lang) {
      if (lang === 1) {
        return seed.newMnemonicInCN()
      } else {
        return seed.newMnemonicInEN()
      }
    },
    createHDWallet(mnemonic) {
      // console.log(isDev)
      const wallet = seed.newWalletFromMnemonic(mnemonic)
      // console.log(wallet)
      // 保存登录时间
      setChromeStorage('loginTime', (new Date()).valueOf()).then(res => {
        // console.log(res)
      })
      if (isDev) {
        window.myChain33WalletInstance = wallet
      } else {
        getBackgroundPage().then(win => {
          win.myChain33WalletInstance = wallet
          // console.log('createHDWallet')
          // console.log(win)
        })
      }
      return wallet
    },
    getWallet() {
      return new Promise((resolve) => {
        // console.log('getWallet')
        // console.log(isDev)
        if (isDev) {
          resolve(window.myChain33WalletInstance)
        } else {
          getBackgroundPage().then(win => {
            // console.log(win)
            // console.log(win.myChain33WalletInstance)
            resolve(win.myChain33WalletInstance)
          })
        }
      })
    },
    newAccount(name) {
      return this.getWallet().then(wallet => {
        // console.log('newAccount')
        // console.log(wallet)
        const account = wallet.newAccount(name)//生成公私钥地址等
        if(wallet&&wallet.accountMap){
          this.$store.commit('Account/UPDATE_ACCOUNTS', wallet.accountMap)
        }
        // this.$store.commit('Account/UPDATE_CURRENTACCOUNT', account)//待删
        this.setCurrentAccount(account)
        setChromeStorage('accountIndexList', wallet.accountIndexList)
      })
    },

    recoverAccount() {
      this.getWallet().then(wallet => {
        console.log('获取索引恢复账户')
        // console.log(wallet)
        //  获取索引恢复账户
        window.chrome.storage.local.get(['accountIndexList'], (result) => {
          // console.log(result)
          if (result.accountIndexList) {
            if(wallet && wallet.recoverAccount){
              wallet.recoverAccount(result.accountIndexList)
            }
            // console.log('wallet.accountMap')
            // console.log(wallet.accountMap)
            if(wallet&&wallet.accountMap){
              this.$store.commit('Account/UPDATE_ACCOUNTS', wallet.accountMap)
            }
            getChromeStorage(['currentAccountIndex']).then(result => {
              let currentAccount = null;
              if(wallet&&wallet.accountMap){
                currentAccount = wallet.accountMap[result['currentAccountIndex']]
              }
              if (!currentAccount&&wallet&&wallet.firstAccount) {
                currentAccount = wallet.firstAccount
              }
              this.setCurrentAccount(currentAccount)
            })
          } else {
            // this.newAccount('Account 1')
          }
        })
      })
    },
    setCurrentAccount(account) {
      return getBackgroundPage().then(win => {
        win.currentAccount = account
        this.$store.commit('Account/UPDATE_CURRENTACCOUNT', account)
        return account
      }).then(account => {
        setChromeStorage('currentAccountIndex', account.index)
      })
    },
    getCurrentAccount() {
      // console.log('getCurrentAccount')
      return getBackgroundPage().then(win => {
        // console.log('win')
        // console.log(win)
        this.$store.commit('Account/UPDATE_CURRENTACCOUNT', win.currentAccount)
        // this.refreshMainAsset();
        // this.refreshParallelAsset();
        return win.currentAccount
      })
    },
    logout() {
      getBackgroundPage().then(win => {
        win.myChain33WalletInstance = null
        win.currentAccount = null
        this.$store.commit('Account/UPDATE_CURRENTACCOUNT', null)
        this.$router.push('login')
      })
    },
    /* 账户相关 -- end */

    /* 交易相关 -- start */

    signRawTransaction(tx, privateKey) {
      return sign.signRawTransaction(tx, privateKey)
    },

    sendToAddr({ privateKey, to, amount, fee, note }, url) {
      // console.log({ privateKey, to, amount, fee, note })
      return this.createRawTransaction({ to, amount, fee, note }, url)
        .then(tx => {
          // console.log(tx)
          return sign.signRawTransaction(tx, privateKey)
        }).then(signedTx => {
          // console.log(signedTx)
          return this.sendTransaction(signedTx, url)
        })
    },

    /* 交易相关 -- end */


    /* 资产相关 -- start */
    refreshMainAsset() {
      console.log('refreshMainAsset')
      console.log(this.currentAccount)
      let addr = this.currentAccount.address
      let url = this.currentMain.url
      return new Promise((resolve, reject) => {
        this.getAddrBalance(addr, 'coins', url).then(res => {
          let payload = { amt: res[0].balance / 1e8 }
          this.$store.commit('Account/UPDATE_MAIN_ASSET', payload)
          this.$store.commit('Account/UPDATE_MAIN_CONNECT', 2)
          resolve('success')
        }).catch(err => {
          this.$store.commit('Account/UPDATE_MAIN_ASSET', {
            amt: 0.0000,
            price: 10
          })
          this.$store.commit('Account/UPDATE_MAIN_CONNECT', 3)
          reject(err)
          console.log(err)
        })
      })
    },

    refreshParallelAsset() {
      let addr = this.currentAccount.address
      let url = this.currentParallel.url
      return new Promise((resolve, reject) => {
        this.getAddrBalance(addr, 'coins', url).then(res => {
          let payload = { amt: res[0].balance / 1e8 }
          this.$store.commit('Account/UPDATE_PARALLEL_ASSET', payload)
          this.$store.commit('Account/UPDATE_PARALLEL_CONNECT', 2)
          resolve('success')
        }).catch(err => {
          this.$store.commit('Account/UPDATE_PARALLEL_ASSET', {
            name: "GBT",
            amt: 0.0000,
            price: 10
          })
          this.$store.commit('Account/UPDATE_PARALLEL_CONNECT', 3)
          reject(err)
          console.log(err)
        })
      })
    },
    /* 资产相关 -- end */

    /* 交易记录相关 --start */

    initTxList(coin, callback) {
      let cNode = coin === "bty" ? this.currentMain : this.currentParallel
      let updateMethod = coin === "bty" ? "Account/UPDATE_CURRENT_MAIN" : "Account/UPDATE_CURRENT_PARALLEL"
      let index = coin === "bty" ? this.currentMain.index : this.currentParallel.index
      let symbol = cNode.name
      let count = 100

      // 拉取数据
      this.getAddrTx(
        this.currentAccount.address,
        this.TX_FLAG.ALL.val,
        count,
        this.TX_DIRECTION.ASC,
        cNode.txHeight,
        cNode.txIndex
      ).then(res => {
        if (res.txs) {
          for (let tx of res.txs) {
            // 过滤 存储
            if (!this.filterAndSaveTx(symbol, updateMethod, tx,index)) {
              continue
            }
          }

          // 重复调用拉取数据
          if (res.txs.length === count) {
            this.initTxList(coin)
          } else {
            callback("finish")
          }
        } else {
          this.getLastHeader(cNode.url).then(res => {
            this.$store.commit(updateMethod, { txHeight: res.height, txIndex: res.txCount,index })
          })
        }
      })
    },
    getTxList(coin, typeTy, advanceNum, refresh, callback) {
      let cNode = coin === "bty" ? this.currentMain : this.currentParallel
      let updateMethod = coin === "bty" ? "Account/UPDATE_CURRENT_MAIN" : "Account/UPDATE_CURRENT_PARALLEL"
      let index = coin === "bty" ? this.currentMain.index : this.currentParallel.index
      let symbol = cNode.name
      let keyName = typeTy === -1 ? TABLE_DATA.index[0].name : TABLE_DATA.index[1].name
      let keyData = typeTy === -1 ? symbol : [symbol, typeTy]

      // 拉取数据
      if (refresh) {
        this.getAddrTx(
          this.currentAccount.address,
          this.TX_FLAG.ALL.val,
          0,
          this.TX_DIRECTION.ASC,
          cNode.txHeight,
          cNode.txIndex,
          cNode.url
        ).then(res => {
          console.log('1initTxList++++++++++++++')
          console.log(res)
          if (res.txs) {
            for (let tx of res.txs) {
              // 过滤 存储
              if (!this.filterAndSaveTx(coin, updateMethod, tx,index)) {
                continue
              }
            }
          }
          // console.log(keyName, keyData)
          dbHelper.getCursorByIndex(TABLE_NAME, keyName, keyData, advanceNum, callback)
        })
      } else {
        dbHelper.getCursorByIndex(TABLE_NAME, keyName, keyData, advanceNum, callback)
      }
    },

    filterAndSaveTx(coin, updateMethod, tx,index) {
      console.log('filterAndSaveTx')
      let cNode = coin === "bty" ? this.currentMain : this.currentParallel
      let symbol = cNode.name
      let lastTx = null
      let createNewTx = false
      let blockHeight = tx.height;
      let txIndex = tx.index;
      const paraName = this.currentParallel.name
      const execerPrefix = "user.p." + paraName + "."

      let amount = tx.amount;
      let strToAddr = tx.tx.to;
      let strFromAddr = tx.fromAddr;
      let strTxHash = tx.txHash;
      let nTime = tx.blockTime;
      let nFee = tx.tx.fee;
      let strExecer = tx.tx.execer;
      let strActionname = tx.actionName;
      let nTy = tx.receipt.ty;

      let strNote = "";
      if (tx.tx && tx.tx.payload && tx.tx.payload.Value && tx.tx.payload.Value.Transfer) {
        strNote = tx.tx.payload.Value.Transfer.note;
      }

      let strError = "unKnow";
      if (nTy === 1) {
        let errors = tx.receipt.logs;
        if (errors) {
          for (let err of errors) {
            if (err.ty === 1) {
              strError = err.log;[]
              break;
            }
          }
        }
      }

      if (coin === "bty") {
        if (tx.tx.execer === "coins" && tx.actionName === "transfer" && strError === "unKnow") {
          createNewTx = true
        }
      } else {
        if (tx.tx.execer === execerPrefix + "coins" && (tx.actionName === "transfer" || tx.actionName === "withdraw")) {
          createNewTx = true
        }
      }
      console.log(createNewTx+'===')
      if (createNewTx) {
        lastTx = new TransactionsListEntry(
          paraName,
          symbol,
          this.currentAccount.address,
          blockHeight,
          txIndex,
          nTime,
          strToAddr,
          strFromAddr,
          strTxHash,
          amount,
          nFee,
          strExecer,
          strActionname,
          nTy,
          strNote,
          strError
        )
        dbHelper.insert(TABLE_NAME, lastTx)
      }

      this.$store.commit(updateMethod, { txHeight: blockHeight, txIndex: txIndex ,index})
      return lastTx
    }
    /* 交易记录相关 --end */

  },
  filters: {
    numFilter(val, num) {
      if (val || val == 0) {
        let f = parseFloat(val),
          result = null;
        if (num == 4) {
          result = Math.floor(f * 10000) / 10000;
        } else {
          result = Math.floor(f * 100) / 100;
        }
        return parseFloat(result).toFixed(num)
      }
    },
    longFilter(val, num){
      if(val || val== 0){
        let f = parseFloat(val)
        return (f / 1e8).toFixed(num)
      }
    }
  }
}