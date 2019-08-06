import chain33API from '@/mixins/chain33API'
import { seed, sign } from '@33cn/wallet-base'
import {createNamespacedHelpers} from 'vuex'

const {mapState} = createNamespacedHelpers('Account')
let isDev = process.env.NODE_ENV === 'development'


export default {
    mixins: [chain33API],
    computed: {
      ...mapState(['accountMap', 'currentAccount'])
    },
    methods: {

        mainCoins2Paracross({ privateKey, amount, fee }) {
            const to = "1HPkPopVe3ERfvaAgedDtJQ792taZFEHCe"
            return this.createRawTransaction(to, amount, fee, note).then(tx => {
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        },

        main2Parallel({ privateKey, to, amount }) {
            const execer = "user.p.fzmtest.paracross"
            const actionName = "ParacrossAssetTransfer"
            const payload = {
                execName: "user.p.fzmtest.paracross",
                to: to,
                amount: amount
            }
            return this.createTransaction(execer, actionName, payload).then(tx => {
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        },

        parallelParacross2Trade({ privateKey, to, amount }) {
            const execer = "user.p.fzmtest.paracross"
            const actionName = "TransferToExec"
            const payload = {
                execName: "user.p.fzmtest.trade",
                to: to,
                amount: amount,
                cointoken: "coins.bty"
            }
            return this.createTransaction(execer, actionName, payload).then(tx => {
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        },

        parallelMarketSell(boardlotCnt, fee) {
            const buyID = ""
            return this.createRawTradeSellMarketTx(buyID, boardlotCnt, fee);
        },

        parallelTrade2Coins({ privateKey, to, amount, fee }) {
            const execName = "user.p.fzmtest.trade"
            isWithdraw = true
            return this.createRawTransactionWithExec(to, amount, fee, execName, isWithdraw).then(tx => {
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        },

        transferBTY2GameCoin(privateKey, amount) {
            const fee = 0
            const to = this.currentAccount.address
            return this.mainCoins2Paracross({ privateKey, amount, fee }).then(() => {
                return this.main2Parallel({ privateKey, to, amount })
            }).then(() => {
                return this.parallelParacross2Trade({ privateKey, to, amount })
            }).then(() => {
                return this.parallelMarketSell(amount, fee)
            }).then(() => {
                return this.parallelTrade2Coins({ privateKey, to, amount, fee })
            })
        },

        parallelCoins2Dice({ privateKey, to, amount, fee }) {
            const execName = "user.p.fzmtest.user.wasm.dice"
            isWithdraw = false
            return this.createRawTransactionWithExec(to, amount, fee, execName, isWithdraw).then(tx => {
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        },





        mainParacross2Coins() {
        },
        parallel2Main() {
        },
        parallelTrade2Paracross() {
        },
        parallelMarketBuy() {
        },
        parallelCoins2Trade() {
        },
        parallelDice2Coins() {
        }


    }
}