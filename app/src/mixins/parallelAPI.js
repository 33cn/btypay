import chain33API from '@/mixins/chain33API'
import { seed, sign } from '@33cn/wallet-base'
import { createNamespacedHelpers } from 'vuex'

const { mapState } = createNamespacedHelpers('Account')
// let isDev = process.env.NODE_ENV === 'development'


export default {
    mixins: [chain33API],
    computed: {
        ...mapState(['accountMap', 'currentAccount'])
    },
    methods: {
        // 主链bty从coins执行器转移到paracross执行器
        mainCoins2Paracross(privateKey, amount, fee, note = '') {
            const to = "1GUhbeySSNywQcGcsjhPPXMX7iRZ6P6ovb";
            // const to = "1HPkPopVe3ERfvaAgedDtJQ792taZFEHCe"
            // const to = '1NN5DQHp5goSLLFe6BhfL8DKALoCNuR9PT'
            return this.createRawTransaction(to, amount, fee, note).then(tx => {
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        },
        // 资产从主链转移到平行链（默认位于平行链的paracross执行器下）
        main2Parallel(privateKey, to, amount) {
            const execer = "user.p.gbttest.paracross"
            const actionName = "ParacrossAssetTransfer"
            const payload = {
                execName: "user.p.gbttest.paracross",
                to: to,
                amount: amount
            }
            return this.createTransaction(execer, actionName, payload)
        },
        // 平行链资产从paracross执行器转移到trade执行器
        parallelParacross2Trade(privateKey, to, amount) {
            const execer = "user.p.gbttest.paracross"
            const actionName = "TransferToExec"
            const payload = {
                execName: "user.p.gbttest.trade",
                to: to,
                amount: amount,
                cointoken: "coins.bty"
            }
            return this.createTransaction(execer, actionName, payload)
        },
        // 生成卖出指定买单的token的交易（未签名）
        parallelMarketSell(boardlotCnt, fee) {
            const buyID = "26b724c75159de8037f0ade34518550b4cdf7fe18671c9e54344b923885e1916"
            return this.createRawTradeSellMarketTx(buyID, boardlotCnt, fee);
        },
        // 玩家获得的平行链主代币位于trade合约下，提币到coins合约
        parallelTrade2Coins(privateKey, to, amount, fee) {
            const execName = "user.p.gbttest.trade"
            const isWithdraw = true
            return this.createRawTransactionWithExec(to, amount, fee, execName, isWithdraw)
        },
        // 余额从coins执行器转到dice合约,游戏币充值完成
        parallelCoins2Dice(privateKey, to, amount, fee) {
            const execName = "user.p.gbttest.user.wasm.dice"
            const isWithdraw = false
            return this.createRawTransactionWithExec(to, amount, fee, execName, isWithdraw).then(tx => {
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        },

        transferBTY2GameCoin(privateKey, amount) {
            const fee = 0;
            const to = this.currentAccount.address
            let arr = [];
            return this.mainCoins2Paracross(privateKey, amount, fee).then(() => {
                return this.main2Parallel(privateKey, to, amount)
            }).then((res) => {
                arr.push(res)
                console.log(res)
                return this.parallelParacross2Trade(privateKey, to, amount)
            }).then((res) => {
                arr.push(res)
                console.log(res)
                return this.parallelMarketSell(amount, fee)
            }).then((res) => {
                arr.push(res)
                console.log(res)
                return this.parallelTrade2Coins(privateKey, to, amount, fee)
            }).then((res)=>{
                console.log(res)
                arr.push(res)
                console.log(arr)
                return this.CreateRawTxGroup(arr)
                // return this.parallelTrade2Coins(privateKey, to, amount, fee)
            }).then(tx=>{
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        },


        mainParacross2Coins(privateKey, amount, fee, note = '') {
            const to = "1HPkPopVe3ERfvaAgedDtJQ792taZFEHCe"
            // const to = '1NN5DQHp5goSLLFe6BhfL8DKALoCNuR9PT'
            return this.createRawTransaction(to, amount, fee, note).then(tx => {
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        },
        parallel2Main(privateKey, to, amount) {
            const execer = "user.p.gbttest.paracross"
            const actionName = "ParacrossAssetTransfer"
            const payload = {
                execName: "user.p.gbttest.paracross",
                to: to,
                amount: amount
            }
            return this.createTransaction(execer, actionName, payload)
        },
        parallelTrade2Paracross(privateKey, to, amount) {
            const execer = "user.p.gbttest.paracross"
            const actionName = "Withdraw"
            const payload = {
                execName: "user.p.gbttest.trade",
                to: to,
                amount: amount,
                cointoken: "coins.bty"
            }
            return this.createTransaction(execer, actionName, payload)
        },
        parallelMarketBuy(boardlotCnt, fee) {
            const buyID = "26b724c75159de8037f0ade34518550b4cdf7fe18671c9e54344b923885e1916"
            return this.createRawTradeSellMarketTx(buyID, boardlotCnt, fee);
        },
        parallelCoins2Trade(privateKey, to, amount, fee) {
            const execName = "user.p.gbttest.trade"
            const isWithdraw = false
            return this.createRawTransactionWithExec(to, amount, fee, execName, isWithdraw)
        },
        parallelDice2Coins(privateKey, to, amount, fee) {
            const execName = "user.p.gbttest.user.wasm.dice"
            const isWithdraw = true
            return this.createRawTransactionWithExec(to, amount, fee, execName, isWithdraw).then(tx => {
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        },
        transferGameCoin2BTY(privateKey, amount) {
            const fee = 0
            const to = this.currentAccount.address
            return this.parallelCoins2Trade().then(() => {
                return this.parallelMarketBuy()
            }).then(() => {
                return this.parallelTrade2Paracross()
            }).then(() => {
                return this.parallel2Main()
            }).then(() => {
                return this.mainParacross2Coins()
            })
        },
        transferGameCoin2BTY1(privateKey, amount){
            const fee = 0
            const to = this.currentAccount.address
            let arr = [];
            return this.parallelCoins2Trade(privateKey, to, amount, fee).then((res) => {
                console.log(res)
                arr.push(res)
                return this.parallelMarketBuy(amount, fee)
            }).then((res) => {
                console.log(res)
                arr.push(res)
                return this.parallelTrade2Paracross(privateKey, to, amount)
            }).then((res) => {
                console.log(res)
                arr.push(res)
                return this.parallel2Main(privateKey, to, amount)
            }).then((res)=>{
                console.log(res)
                arr.push(res)
                return this.mainParacross2Coins(privateKey, amount, fee)
            }).then(()=>{
                return this.CreateRawTxGroup(arr)
            }).then(tx=>{
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        }

    }
}