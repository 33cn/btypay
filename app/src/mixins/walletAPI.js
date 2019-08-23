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
    { name: "symbol_typeTy", key: ['symbol', 'typeTy'], payload: { unique: false } },
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
    // getChromeStorage(keys) {
    //   return new Promise(resolve => {
    //     window.chrome.storage.local.get(keys, (result) => {
    //       resolve(result)
    //     })
    //   })
    // },
    // setChromeStorage(key, value) {
    //   return new Promise(resolve => {
    //     window.chrome.storage.local.set({ [key]: value }, () => {
    //       resolve('success')
    //     })
    //   })
    // },
    /* 账户相关 -- start */
    newMnemonic(lang) {
      if (lang === 1) {
        return seed.newMnemonicInCN()
      } else {
        return seed.newMnemonicInEN()
      }
    },
    createHDWallet(mnemonic) {
      const wallet = seed.newWalletFromMnemonic(mnemonic)
      if (isDev) {
        window.myChain33WalletInstance = wallet
      } else {
        getBackgroundPage().then(win => {
          win.myChain33WalletInstance = wallet
        })
      }
      return wallet
    },
    getWallet() {
      return new Promise((resolve) => {
        if (isDev) {
          resolve(window.myChain33WalletInstance)
        } else {
          getBackgroundPage().then(win => {
            resolve(win.myChain33WalletInstance)
          })
        }
      })
    },
    newAccount(name) {
      return this.getWallet().then(wallet => {
        const account = wallet.newAccount(name)//生成公私钥地址等
        this.$store.commit('Account/UPDATE_ACCOUNTS', wallet.accountMap)
        this.$store.commit('Account/UPDATE_CURRENTACCOUNT', account)//待删
        this.setCurrentAccount(account)
        setChromeStorage('accountIndexList', wallet.accountIndexList)
      })
    },

    recoverAccount() {
      this.getWallet().then(wallet => {
        //  获取索引恢复账户
        window.chrome.storage.local.get(['accountIndexList'], (result) => {
          // console.log(result)
          if (result.accountIndexList) {
            wallet.recoverAccount(result.accountIndexList)
            this.$store.commit('Account/UPDATE_ACCOUNTS', wallet.accountMap)
            getChromeStorage(['currentAccountIndex']).then(result => {
              let currentAccount = wallet.accountMap[result['currentAccountIndex']]
              if (!currentAccount) {
                currentAccount = wallet.firstAccount
              }
              this.setCurrentAccount(currentAccount)
            })
          } else {
            this.newAccount('Account 1')
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
      return getBackgroundPage().then(win => {
        this.$store.commit('Account/UPDATE_CURRENTACCOUNT', win.currentAccount)
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

    sendToAddr({ privateKey, to, amount, fee, note }) {
      console.log({ privateKey, to, amount, fee, note })
      return this.createRawTransaction(to, amount, fee, note)
        .then(tx => {
          console.log(tx)
          return sign.signRawTransaction(tx, privateKey)
        }).then(signedTx => {
          return this.sendTransation(signedTx)
        })
    },

    /* 交易相关 -- end */


    /* 资产相关 -- start */
    refreshMainAsset() {
      let addr = this.currentAccount.address
      let url = this.currentMain.url
      this.getAddrBalance(addr, 'coins', url).then(res => {
        let payload = { amt: res[0].balance / 1e8 }
        // console.log(payload)
        this.$store.commit('Account/UPDATE_MAIN_ASSET', payload)
      })
    },

    refreshParallelAsset() {
      let addr = this.currentAccount.address
      let url = this.currentParallel.url
      this.getAddrBalance(addr, 'coins', url).then(res => {
        let payload = { amt: res[0].balance / 1e8 }
        // console.log(payload)
        this.$store.commit('Account/UPDATE_PARALLEL_ASSET', payload)
      })
    },
    /* 资产相关 -- end */

    /* 交易记录相关 --start */
    getTxCursor(coin, flag, callback) {
      // let cNode = this.currentNode(coin)
      // let symbol = cNode.coin
      // dbHelper.getCursorByIndex(TABLE_NAME, TABLE_DATA.index[0].name, [symbol, flag], callback)
    },

    refreshTxList(coin, flag, callback) {
      let cNode = coin === "bty" ? this.currentMain : this.currentParallel
      let updateMethod = coin === "bty" ? "Account/UPDATE_CURRENT_MAIN" : "Account/UPDATE_CURRENT_PARALLEL"

      // 拉取数据
      this.getAddrTx(
        this.currentAccount.address,
        this.TX_FLAG.ALL,
        0,
        this.TX_DIRECTION.REAR,
        cNode.height,
        cNode.index
      ).then(res => {

        if (res.txs) {
          let lastTx = null
          for (let tx of res.txs) {
            // 过滤
            if (tx.tx.execer == "coins") {
              let blockHeight = tx.height;
              let txIndex = tx.index;
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
              if (tx.tx && tx.tx.payload && tx.tx.Value && tx.tx.Value.Transfer) {
                strNote = tx.tx.payload.Value.Transfer.note;
              }

              let strError = "unKnow";
              if (nTy === 1) {
                let errors = tx.receipt.logs;
                if (errors) {
                  for (let err of errors) {
                    if (err.ty === 1) {
                      strError = err.log;
                      break;
                    }
                  }
                }
              }

              lastTx = new TransactionsListEntry(
                cNode.coin,
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

              // 存储
              dbHelper.insert(TABLE_NAME, lastTx)
            } else {
              continue
            }
          }

          this.$store.commit(updateMethod, {height: lastTx.height, index: lastTx.index})
          dbHelper.getCursorByIndex(TABLE_NAME, TABLE_DATA.index[0].name, [symbol, flag], callback)
        }
      })



    },
    /* 交易记录相关 --end */

  },
  filters: {
    numFilter(val) {
      if (val || val == 0) {
        let f = parseFloat(val)
        let result = Math.floor(f * 100) / 100;
        return parseFloat(result).toFixed(2)
      }
    }
  }
}