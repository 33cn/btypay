import chain33API from '@/mixins/chain33API'
import { createNamespacedHelpers } from 'vuex'
import { signRawTx, signGroupTx } from '@/libs/sign.js'
import Long from 'long'

const { mapState } = createNamespacedHelpers('Account')

export default {
    mixins: [chain33API],
    computed: {
        ...mapState(['accountMap', 'currentAccount', 'currentMain', 'currentParallel']),
        paraAddr() {
            return this.currentParallel.paraAddr
        },
        tradeAddr() {
            return this.currentParallel.tradeAddr
        },
        // paraExecer() {
        //     return "user.p." + "issuance" + ".paracross"
        // },
        // tradeExecer() {
        //     return "user.p." + "issuance" + ".trade"
        // },
        // diceExecer() {
        //     return "user.p." + "issuance" + ".wasm.dice"
        // },
        paraExecer() {
            return "user.p." + this.currentParallel.name + ".paracross"
        },
        tradeExecer() {
            return "user.p." + this.currentParallel.name + ".trade"
        },
        diceExecer() {
            return "user.p." + this.currentParallel.name + ".wasm.dice"
        },
    },
    data() {
        return {
            PARA_ERROR: {
                PARAM_ERROR: { code: 1, desc: "参数错误" },
                TRADE_CONTRACT_NOT_SUPPORT: { code: 2, desc: "未部署Trade合约" },
                TRADE_BUY_NO_ORDER: { code: 3, desc: "Trade合约中没有合适的买单" },
                TRADE_SELL_NO_ORDER: { code: 4, desc: "Trade合约中没有合适的卖单" },

                B2G_COIN2PARA_ERROR: { code: 5, desc: "主链提取至paracross发生错误" },
                B2G_PARA_ERROR: { code: 6, desc: "bty跨链兑换发生错误" },
                B2G_TRADE_ERROR: { code: 7, desc: "trade交易发生错误" },

                G2B_TRADE_ERROR: { code: 8, desc: "trade交易发生错误" },
                G2B_PARA_ERROR: { code: 9, desc: "game跨链兑换发生错误" },
                G2B_PARA2COIN_ERROR: { code: 10, desc: "主链提取至cions发生错误" }

            },
            BUY_ID: "",
            SELL_ID: "",
            BUY_LIMIT: {
                minAmt: 0,
                maxAmt: 0,
                amtPerBoardlot: 1
            },
            SELL_LIMIT: {
                minAmt: 0,
                maxAmt: 0,
                pricePerBoardlot: 1
            },
            tokenSymbol:'coins.bty'
        }
    },
    methods: {
        // 主链bty从coins执行器转移到paracross执行器
        mainCoins2Paracross(privateKey, amount, url,type='') {
            let params = {
                to: this.paraAddr,
                execName: "paracross",
                amount: amount
            }
            if(type == 'token'){
                params.isToken = true
                params.isWithdraw = false
                params.tokenSymbol = 'CCNY'
                params.fee = 1*1e5
            }
            console.log(params)
            return this.createRawTransaction(params, url)
                .then(tx => {
                    return signRawTx(tx, privateKey)
                })
                .then(signedTx => {
                    return this.sendTransaction(signedTx, url)
                })
        },
        // 资产从主链转移到平行链（默认位于平行链的paracross执行器下）
        main2Parallel(privateKey, to, amount, url,type='') {
            let params = {
                execer: this.paraExecer,//'user.p.issuance.paracross',//this.paraExecer,
                actionName: "ParacrossAssetTransfer",
                payload: {
                    execName: this.paraExecer,//'user.p.issuance.paracross',//this.paraExecer,
                    to: to,
                    amount: amount
                }
            }
            console.log('=========================')
            console.log(params)
            if(type == 'token'){
                // params.payload.cointoken = 'token.ccny'
                params.payload.tokenSymbol = 'CCNY'
            }
            return this.createTransaction(params, url)
                .then(tx => {
                    return signRawTx(tx, privateKey)
                })
                .then(signedTx => {
                    return this.sendTransaction(signedTx, url)
                })
        },
        // 平行链资产从paracross执行器转移到trade执行器
        parallelParacross2Trade(amount, url,type='') {
            let params = {
                execer: this.paraExecer,
                actionName: "TransferToExec",
                payload: {
                    execName: this.tradeExecer,
                    to: this.tradeAddr,
                    amount: amount,
                    cointoken: "coins.bty",
                    note:''
                }
            }
            if(type == 'token'){
                params.payload.cointoken = 'token.CCNY'
            }
            return this.createTransaction(params, url)
        },
        // 生成卖出指定买单的token的交易（未签名）
        parallelMarketSell(amt, url,type='') {
            // let boardlotCnt = Long.fromValue(amt).divide(this.BUY_LIMIT.amtPerBoardlot).toInt()
            let boardlotCnt= amt
            let buyID = this.BUY_ID
            // if(type == 'token'){
            //     // buyID = 'f814a361bd80d16e809e6c56a87d3e3b567f492f2f2e92482e3a6ec892455f44'
            //     this.getOrder('12qyocayNF7Lv6C9qW4avxs2E7U41fKSfv').then(res=>{
            //         let order = res.orders
            //         for(let i = 0;i < order.length;i++){
            //             if(order[i].tokenSymbol=='token.CCNY'&&order[i].buyID&&parseInt(order[i].totalBoardlot)>1e8){
            //                 buyID = order[i].buyID.split('mavl-trade-buy-')[1]
            //                 break
            //             }
            //         }
            //         return this.createRawTradeSellMarketTx([{ boardlotCnt, buyID }], url)
            //     })
            // }else{
            //     console.log('hhhhhhhhhhhhh')
            //     buyID = 'c0b1cb149ed8ca362975ea68bcc36be634d2527cd2ec099538bfd833b6372c47'
            //     this.getOrder('16ui7XJ1VLM7YXcNhWwWsWS6CRC3ZA2sJ1').then(res=>{
            //         let order = res.orders
            //         for(let i = 0;i < order.length;i++){
            //             if(order[i].tokenSymbol=='coins.bty'&&order[i].buyID&&parseInt(order[i].totalBoardlot)>1e8){
            //                 buyID = order[i].buyID.split('mavl-trade-buy-')[1]
            //                 break
            //             }
            //         }
            //         console.log('============')
            //         console.log({ boardlotCnt, buyID })
            //         console.log('===============')
            //         return this.createRawTradeSellMarketTx([{ boardlotCnt, buyID }], url)
            //     })
            // }
            return this.createRawTradeSellMarketTx([{ boardlotCnt, buyID }], url)
            // let buyID = 'cf215c5e6a09f02b7049b545ddb6ea64d81fcdd0ecba5b92e973ef952e7e6489'
        },
        getTradeBuyOrder(url) {
            let params = {
                tokenSymbol: this.tokenSymbol,//"coins.bty",//'token.CCNY'
                status: 5,//this.TRADE_ORDER_STATUS.ON_BUY,
                count: 10
            }
            return this.getTokenBuyOrderByStatus(params, url).then(res => {
                // console.log('=================================')
                // console.log(res)
                let maxAmt = Long.ZERO
                // console.log(maxAmt)
                if (res && res.orders.length !== 0) {
                    for (let order of res.orders) {
                        let amountPerBoardlot = Long.fromString(order.amountPerBoardlot)
                        let pricePerBoardlot = Long.fromString(order.pricePerBoardlot)
                        let minBoardlot = Long.fromString(order.minBoardlot)
                        let totalBoardlot = Long.fromString(order.totalBoardlot)
                        let tradedBoardlot = Long.fromString(order.tradedBoardlot)

                        let minAmt = minBoardlot.multiply(amountPerBoardlot)
                        let leftAmt = totalBoardlot.subtract(tradedBoardlot).multiply(amountPerBoardlot)

                        if (pricePerBoardlot.notEquals(amountPerBoardlot)) {
                            continue
                        }
                        // if (minAmt.greaterThan("300000000")) {
                        //     continue
                        // }
                        // if (amountPerBoardlot.lessThan("100000") || amountPerBoardlot.greaterThan("300000000")) {
                        //     continue
                        // }
                        if (leftAmt.greaterThan(maxAmt)) {
                            maxAmt = leftAmt
                            this.BUY_ID = order.txHash.replace(/^(0x|0X)/, '')
                            this.BUY_LIMIT.minAmt = minAmt.toString()
                            this.BUY_LIMIT.maxAmt = leftAmt.toString()
                            this.BUY_LIMIT.amtPerBoardlot = amountPerBoardlot.toString()
                        }
                    }
                }
                if (maxAmt.notEquals(Long.ZERO)) {
                    return "success"
                } else {
                    return JSON.stringify(this.PARA_ERROR.TRADE_SELL_NO_ORDER)
                }
            }).catch(err => {
                if (err.message == "ErrNotFound") {
                    return JSON.stringify(this.PARA_ERROR.TRADE_BUY_NO_ORDER)
                } else if (err.message === "ErrNotSupport") {
                    return JSON.stringify(this.PARA_ERROR.TRADE_CONTRACT_NOT_SUPPORT)
                }
            })
        },

        // 玩家获得的平行链主代币位于trade合约下，提币到coins合约
        parallelTrade2Coins(amount, url,type='') {
            const execName = this.tradeExecer
            const isWithdraw = true
            let params = {
                to: this.tradeAddr,
                amount: amount,
                execName: execName,
                isWithdraw: isWithdraw
            }
            if(type == 'token'){
                params.tokenSymbol = 'CCNY'
                params.isToken = true
            }
            return this.createRawTransaction(params, url)
        },
        // 打包三笔交易
        parallelPara2Coins(privateKey, amount, url,type='') {
            let txs = []
            return this.parallelParacross2Trade(amount, url,type).then(tx => {
                console.log('tx0')
                console.log(tx)
                txs.push(tx)
                console.log(url)
                return this.parallelMarketSell(amount, url,type)
            }).then(tx => {
                console.log('tx1')
                console.log(tx)
                txs.push(tx)
                return this.parallelTrade2Coins(amount, url,type)
            }).then(tx => {
                console.log('tx2')
                console.log(tx)
                console.log(txs)
                txs.push(tx)
                return this.createRawTxGroup(txs,url)
            }).then(tx => {
                console.log('createRawTxGroup')
                console.log(tx)
                return signGroupTx(tx, privateKey)
            }).then(signedTx => {
                console.log('signGroupTx')
                console.log(signedTx)
                return this.sendTransaction(signedTx, url)
            })
        },

        // 余额从coins执行器转到dice合约,游戏币充值完成
        parallelCoins2Dice(amount, url, name) {
            console.log('parallelCoins2Dice')
            // const execName = this.diceExecer
            // const isWithdraw = false
            let to = "1DBucY6mWHmnpbQWLP1wTaB1VvpU6B3sCJ"
            let params = {
                to,
                execName: "user.p." + name + ".lottery",
                amount: amount
            }
            console.log(params)
            return this.createRawTransactionWithExec(params, url)
            // .then(tx => {
            //     return signRawTx(tx, privateKey)
            // }).then(signedTx => {
            //     return this.sendTransaction(signedTx)
            // })
        },

        transferBTY2GameCoin(privateKey, amt, callback) {
            window.chrome.runtime.getBackgroundPage(win=>{
                if(win&&win.currentAccount){
                    this.$store.commit('Account/UPDATE_CURRENTACCOUNT', win.currentAccount)
                }
                let to = ''
                if(win.currentAccount.address){
                    to = win.currentAccount.address
                }else{
                    to = this.currentAccount.address
                }
                // let to = '18gKTV6Gx2BCrq9GNXEt6Mqau2L5jvB3Tt'
                console.log('地址to=='+to)
                console.log(to)
                if(to){
                }else{
                    alert('钱包地址为空')
                    return
                }
                let mainUrl = this.currentMain.url
                // let paraUrl = 'http://114.55.11.139:1217'
                let paraUrl = this.currentParallel.url
    
                if (privateKey === void 0) {
                    callback(JSON.stringify(this.PARA_ERROR.PARAM_ERROR))
                    return
                }
                if (amt <= 0) {
                    callback(JSON.stringify(this.PARA_ERROR.PARAM_ERROR))
                    return
                }
                // 跨链兑换
                this.mainCoins2Paracross(privateKey, amt, mainUrl).then(hash1 => {
                    console.log('hash1')
                    console.log(hash1)
                    this.txStateCheckTask(hash1, mainUrl, err1 => {
    
                        if (err1) {
                            this.PARA_ERROR.B2G_COIN2PARA_ERROR.msg = err1
                            callback(JSON.stringify(this.PARA_ERROR.B2G_COIN2PARA_ERROR))
                            return
                        }
    
                        this.main2Parallel(privateKey, to, amt, mainUrl).then(hash2 => {
                            console.log('hash2')
                            console.log(hash2)
                            this.txStateCheckTask(hash2, mainUrl, err2 => {
    
                                if (err2) {
                                    this.PARA_ERROR.B2G_PARA_ERROR.msg = err2
                                    callback(JSON.stringify(this.PARA_ERROR.B2G_PARA_ERROR))
                                    return
                                }
    
                                this.parallelPara2Coins(privateKey, amt, paraUrl).then(hash3 => {
                                    console.log('hash3')
                                    console.log(hash3)
                                    this.txStateCheckTask(hash3, paraUrl, err3 => {
    
                                        if (err3) {
                                            this.PARA_ERROR.B2G_TRADE_ERROR.msg = err3
                                            callback(JSON.stringify(this.PARA_ERROR.B2G_TRADE_ERROR))
                                            return
                                        }
    
                                        callback(JSON.stringify({hash:hash3}))
                                    })
                                    // callback(hash3)
                                })
                            })
                        })
                    })
                })
            })

            // this.parallel2Main(privateKey, to, amt, paraUrl).then(hash => {
            //     console.log(hash)
            // })
            // this.mainParacross2Coins(privateKey, amt, mainUrl).then(hash => {
            //     console.log(hash)
            // })
        },

        mainParacross2Coins(privateKey, amount, url,type='') {
            let params = {
                to: this.paraAddr,
                amount: amount,
                execName: "paracross",
                isWithdraw: true
            }
            if(type == 'token'){
                params.isToken = true
                params.tokenSymbol = 'CCNY'
                params.fee = 1*1e5
            }
            return this.createRawTransaction(params, url).then(tx => {
                return signRawTx(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransaction(signedTx, url)
            })
        },
        parallel2Main(privateKey, to, amount, url,type='') {
            let params = {
                execer: this.paraExecer,
                actionName: "ParacrossAssetTransfer",
                payload: {
                    to: to,
                    execName: this.paraExecer,
                    amount: amount,
                    isWithdraw: true
                }
            }
            if(type == 'token'){
                params.payload.tokenSymbol = 'CCNY'
            }
            console.log(params)
            return this.createTransaction(params, url).then(tx => {
                console.log(tx)
                return signRawTx(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransaction(signedTx, url)
            })
        },
        parallelTrade2Paracross(amount, url,type) {
            let params = {
                execer: this.paraExecer,
                actionName: "Withdraw",
                payload: {
                    to: this.tradeAddr,
                    execName: this.tradeExecer,
                    amount: amount,
                    cointoken: "coins.bty",
                    note:''
                }
            }
            if(type == 'token'){
                params.payload.cointoken = 'token.CCNY'
            }
            return this.createTransaction(params, url)
        },
        parallelMarketBuy(amt, url,type='') {
            let boardlotCnt = Long.fromValue(amt).divide(this.SELL_LIMIT.pricePerBoardlot).toInt()
            let buyID = this.BUY_ID
            // let buyID = 'cf215c5e6a09f02b7049b545ddb6ea64d81fcdd0ecba5b92e973ef952e7e6489'//this.BUY_ID;//ccny反向
            // let buyID = 'bd996e1ac00ea4ca341b591e1c0a74206c2e061528015ff1364bfd6ea81f921c'//bty反向
            // if(type == 'token'){
            //     // buyID = 'cf215c5e6a09f02b7049b545ddb6ea64d81fcdd0ecba5b92e973ef952e7e6489'//this.BUY_ID;//ccny反向
            //     this.getOrder('12qyocayNF7Lv6C9qW4avxs2E7U41fKSfv').then(res=>{
            //         let order = res.orders
            //         for(let i = 0;i < order.length;i++){
            //             if(order[i].tokenSymbol=='CCNY'&&order[i].buyID&&parseInt(order[i].totalBoardlot)>1e8){
            //                 buyID = order[i].buyID.split('mavl-trade-buy-')[1]
            //                 break
            //             }
            //         }
            //         return this.createRawTradeSellMarketTx([{ boardlotCnt, buyID }], url)
            //     })
            // }else{
            //     // buyID = 'bd996e1ac00ea4ca341b591e1c0a74206c2e061528015ff1364bfd6ea81f921c'//bty反向
            //     this.getOrder('16ui7XJ1VLM7YXcNhWwWsWS6CRC3ZA2sJ1').then(res=>{
            //         let order = res.orders
            //         for(let i = 0;i < order.length;i++){
            //             if(order[i].tokenSymbol=='para'&&order[i].buyID&&parseInt(order[i].totalBoardlot)>1e8){
            //                 buyID = order[i].buyID.split('mavl-trade-buy-')[1]
            //                 break
            //             }
            //         }
            //         return this.createRawTradeSellMarketTx([{ boardlotCnt, buyID }], url)
            //     })
            // }
            // return this.createRawTradeBuyMarketTx([{ sellID, boardlotCnt }], url);
            return this.createRawTradeSellMarketTx([{ boardlotCnt, buyID }], url) 
        },
        getTradeSellOrder(url) {
            let params = {
                tokenSymbol: this.tokenSymbol,//"coins.bty",//'token.CCNY'
                status: 5,//this.TRADE_ORDER_STATUS.ON_SALE,
                count: 10,//"10000000"
            }
            // return this.getTokenBuyOrderByStatus(params, url).then(res => {
            //     // console.log('=================================')
            //     // console.log(res)
            //     let maxAmt = Long.ZERO
            //     // console.log(maxAmt)
            //     if (res && res.orders.length !== 0) {
            //         for (let order of res.orders) {
            //             let amountPerBoardlot = Long.fromString(order.amountPerBoardlot)
            //             let pricePerBoardlot = Long.fromString(order.pricePerBoardlot)
            //             let minBoardlot = Long.fromString(order.minBoardlot)
            //             let totalBoardlot = Long.fromString(order.totalBoardlot)
            //             let tradedBoardlot = Long.fromString(order.tradedBoardlot)

            //             let minAmt = minBoardlot.multiply(amountPerBoardlot)
            //             let leftAmt = totalBoardlot.subtract(tradedBoardlot).multiply(amountPerBoardlot)

            //             if (pricePerBoardlot.notEquals(amountPerBoardlot)) {
            //                 continue
            //             }
            //             // if (minAmt.greaterThan("300000000")) {
            //             //     continue
            //             // }
            //             // if (amountPerBoardlot.lessThan("100000") || amountPerBoardlot.greaterThan("300000000")) {
            //             //     continue
            //             // }
            //             if (leftAmt.greaterThan(maxAmt)) {
            //                 maxAmt = leftAmt
            //                 this.BUY_ID = order.txHash.replace(/^(0x|0X)/, '')
            //                 this.BUY_LIMIT.minAmt = minAmt.toString()
            //                 this.BUY_LIMIT.maxAmt = leftAmt.toString()
            //                 this.BUY_LIMIT.amtPerBoardlot = amountPerBoardlot.toString()
            //             }
            //         }
            //     }
            //     if (maxAmt.notEquals(Long.ZERO)) {
            //         return "success"
            //     } else {
            //         return JSON.stringify(this.PARA_ERROR.TRADE_SELL_NO_ORDER)
            //     }
            // }).catch(err => {
            //     if (err.message == "ErrNotFound") {
            //         return JSON.stringify(this.PARA_ERROR.TRADE_BUY_NO_ORDER)
            //     } else if (err.message === "ErrNotSupport") {
            //         return JSON.stringify(this.PARA_ERROR.TRADE_CONTRACT_NOT_SUPPORT)
            //     }
            // })
            return this.getTokenSellOrderByStatus(params, url).then(res => {
                console.log("======================")
                console.log(res)
                let maxAmt = Long.ZERO
                if (res && res.orders.length !== 0) {
                    for (let order of res.orders) {
                        let amountPerBoardlot = Long.fromString(order.amountPerBoardlot)
                        let pricePerBoardlot = Long.fromString(order.pricePerBoardlot)
                        let minBoardlot = Long.fromString(order.minBoardlot)
                        let totalBoardlot = Long.fromString(order.totalBoardlot)
                        let tradedBoardlot = Long.fromString(order.tradedBoardlot)

                        let minAmt = minBoardlot.multiply(pricePerBoardlot)
                        let leftAmt = totalBoardlot.subtract(tradedBoardlot).multiply(pricePerBoardlot)

                        if (pricePerBoardlot.notEquals(amountPerBoardlot)) {
                            continue
                        }
                        // if (minAmt.greaterThan("300000000")) {
                        //     continue
                        // }
                        // if (pricePerBoardlot.lessThan("100000") || pricePerBoardlot.greaterThan("300000000")) {
                        //     continue
                        // }
                        if (leftAmt.greaterThan(maxAmt)) {
                            maxAmt = leftAmt
                            this.SELL_ID = order.txHash.replace(/^(0x|0X)/, '')
                            this.SELL_LIMIT.minAmt = minAmt.toString()
                            this.SELL_LIMIT.maxAmt = leftAmt.toString()
                            this.SELL_LIMIT.pricePerBoardlot = pricePerBoardlot.toString()
                        }
                    }
                }
                if (maxAmt.notEquals(Long.ZERO)) {
                    return "success"
                } else {
                    return JSON.stringify(this.PARA_ERROR.TRADE_SELL_NO_ORDER)
                }
            }).catch(err => {
                console.log('=====')
                console.log(err)
                if (err.message === "ErrNotFound") {
                    return JSON.stringify(this.PARA_ERROR.TRADE_SELL_NO_ORDER)
                } else if (err.message === "ErrNotSupport") {
                    return JSON.stringify(this.PARA_ERROR.TRADE_CONTRACT_NOT_SUPPORT)
                }
            })

        },
        parallelCoins2Trade(amount, url,type) {
            let params = {
                execName: this.tradeExecer,
                to: this.tradeAddr,
                amount: amount
            }
            if(type == 'token'){
                params.isToken = true
                params.isWithdraw = false
                params.tokenSymbol = 'CCNY'
                params.fee = 1*1e5
            }
            return this.createRawTransaction(params, url)
        },
        // 打包交易组
        parallelCoins2Para(privateKey, amount, url,type='') {
            let txs = []
            return this.parallelCoins2Trade(amount, url,type).then(tx => {
                console.log('parallelCoins2Trade')
                console.log(tx)
                txs.push(tx)
                return this.parallelMarketBuy(amount, url,type)
            }).then(tx => {
                console.log('parallelMarketBuy')
                console.log(tx)
                txs.push(tx)
                return this.parallelTrade2Paracross(amount, url,type)
            }).then(tx => {
                console.log('parallelTrade2Paracross')
                console.log(tx)
                txs.push(tx)
                console.log(txs)
                return this.createRawTxGroup(txs,url)
            }).then(tx => {
                console.log('createRawTxGroup')
                console.log(tx)
                return signGroupTx(tx, privateKey)
            }).then(signedTx => {
                console.log('signGroupTx')
                console.log(signedTx)
                return this.sendTransaction(signedTx, url)
            })
        },
        parallelDice2Coins(privateKey, to, amount, fee) {
            const execName = this.diceExecer
            const isWithdraw = true
            return this.createRawTransactionWithExec(to, amount, fee, execName, isWithdraw).then(tx => {
                return signRawTx(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransaction(signedTx)
            })
        },
        transferGameCoin2BTY(privateKey, amt, callback) {
            window.chrome.runtime.getBackgroundPage(win=>{
                if(win&&win.currentAccount){
                    this.$store.commit('Account/UPDATE_CURRENTACCOUNT', win.currentAccount)
                }
                let to = ''
                if(win.currentAccount.address){
                    to = win.currentAccount.address
                }else{
                    to = this.currentAccount.address
                }
                // let to = this.currentAccount.address
                let mainUrl = this.currentMain.url
                let paraUrl = this.currentParallel.url
    
                if (privateKey === void 0) {
                    callback(JSON.stringify(this.PARA_ERROR.PARAM_ERROR))
                    return
                }
                if (amt <= 0) {
                    callback(JSON.stringify(this.PARA_ERROR.PARAM_ERROR))
                    return
                }
                // 跨链兑换
                this.parallelCoins2Para(privateKey, amt, paraUrl).then(hash1 => {
                    console.log('hash1')
                    console.log(hash1)
                    this.txStateCheckTask(hash1, paraUrl, err1 => {
    
                        if (err1) {
                            this.PARA_ERROR.G2B_TRADE_ERROR.msg = err1
                            callback(JSON.stringify(this.PARA_ERROR.G2B_TRADE_ERROR))
                            return
                        }
    
                        this.parallel2Main(privateKey, to, amt, paraUrl).then(hash2 => {
                            console.log('hash2')
                            console.log(hash2)
                            this.mainParaBalanceCheckTask('',to, (paraAmt, err2) => {
                                if(err2 && err2 == 'no times'){
                                    callback(JSON.stringify({desc:'主链paracross余额为'+paraAmt,msg:'paraAmt'}))
                                    return
                                }
                                if (err2) {
                                    this.PARA_ERROR.G2B_PARA_ERROR.msg = err2
                                    callback(JSON.stringify(this.PARA_ERROR.G2B_PARA_ERROR))
                                    return
                                }
    
                                this.mainParacross2Coins(privateKey, paraAmt, mainUrl).then(hash3 => {
                                    console.log('hash3')
                                    console.log(hash3)
                                    this.txStateCheckTask(hash3, mainUrl, err3 => {
    
                                        if (err3) {
                                            this.PARA_ERROR.G2B_PARA2COIN_ERROR.msg = err3
                                            callback(JSON.stringify(this.PARA_ERROR.G2B_PARA2COIN_ERROR))
                                            return
                                        }
                                        callback(JSON.stringify({hash:hash3}))
    
                                    })
    
                                })
                            })
                        })
                    })
                })
            })
        },


        txStateCheckTask(hash, url, callback, times) {
            if (times === void 0) times = 0
            setTimeout(() => {
                this.queryTx(hash, url).then(res => {
                    console.log('===res===')
                    console.log(res)
                    if (res && res.receipt.ty === 2) {
                        callback()
                    } else {
                        let errMsg = ""
                        let errs = res.receipt.logs
                        if(errs){
                            for (let err of errs) {
                                if (err.ty === 1) {
                                    errMsg = err.log
                                }
                            }
                        }else{
                            if(res.tx.next){
                                this.txStateCheckTask(res.tx.next, url, callback, ++times)
                            }else{
                                errMsg='发生错误'
                            }
                        }
                        callback(errMsg)
                    }
                }).catch(err => {
                    console.log('===hash检测===')
                    console.log(err)
                    if (err.message == "tx not exist" && times < 12) {
                        this.txStateCheckTask(hash, url, callback, ++times)
                    }
                })
            }, 5000);
        },

        mainParaBalanceCheckTask(type='',addr, callback, times) {
            console.log('进来了')
            let execer = 'paracross'
            let asset_exec = 'coins'
            let asset_symbol = 'bty'
            if (times === void 0) times = 0
            let inter = setTimeout(() => {
                if(type == 'token'){
                    asset_exec = 'token'
                    asset_symbol = 'CCNY'
                }
                this.getAddrBalance(addr, execer, this.currentMain.url,asset_exec,asset_symbol).then(res => {
                    console.log('getAddrBalance')
                    console.log(res)
                    if (res[0].balance) {
                        clearTimeout(inter)
                        callback(res[0].balance)
                    }
                    // else if(res[0].balance == 0){
                    //     callback(res[0].balance)
                    // } 
                    else if (times < 12) {
                        // if(times>8){
                        //     callback(1*1e8)
                        //     return
                        // }
                        this.mainParaBalanceCheckTask(type,addr, callback, ++times)
                    }else{
                        callback(0, 'no times')
                    }
                }).catch(err => {
                    callback(0, err)
                })
            }, 5000);
        },
        // 获取买卖单
        getOrder(to){
            let url = this.currentParallel.url
            let params = {
                "status" : 1,
                "addr" : to,
                "direction": 1,
                "count" : 10,
                "fromKey" : ""
            }
            return this.GetOnesOrderWithStatus(params,url)
        },
        getOrders(to,tokenSymbol){
            let url = this.currentParallel.url
            let params = {
                "status" : 1,
                "addr" : to,
                "direction": 1,
                "count" : 10,
                "fromKey" : ""
            }
            this.GetOnesOrderWithStatus(params,url).then(res=>{
                let order = res.orders
                for(let i = 0;i < order.length;i++){
                    if(order[i].tokenSymbol==tokenSymbol&&order[i].buyID&&parseInt(order[i].totalBoardlot)>1e8){
                        this.BUY_ID = order[i].buyID.split('mavl-trade-buy-')[1]
                        break
                    }
                }
            })
        },
        // BTY主链向平行链
        btyMain2parallel(privateKey, amt, callback){
            this.BUY_ID = 'c0b1cb149ed8ca362975ea68bcc36be634d2527cd2ec099538bfd833b6372c47'
            this.getOrders('16ui7XJ1VLM7YXcNhWwWsWS6CRC3ZA2sJ1','coins.bty')
            this.transferBTY2GameCoin(privateKey, amt, callback)
        },
        // BTY平行链向主链
        btyParallel2Main(privateKey, amt, callback){
            this.BUY_ID = '1a8b6f5cfab8ebe4208a58be4a33768d20122ac750715fb4229951c624a8819e'
            this.getOrders('16ui7XJ1VLM7YXcNhWwWsWS6CRC3ZA2sJ1','para')
            this.transferGameCoin2BTY(privateKey, amt, callback)
        },
        // CCNY主链向平行链
        ccnyMain2parallel(privateKey, amt, callback){
            window.chrome.runtime.getBackgroundPage(win=>{
                if(win&&win.currentAccount){
                    this.$store.commit('Account/UPDATE_CURRENTACCOUNT', win.currentAccount)
                }
                let to = ''
                if(win.currentAccount.address){
                    to = win.currentAccount.address
                }else{
                    to = this.currentAccount.address
                }
                this.BUY_ID = '39a7d4d7f171c2be87985e7689d5778f9a675a0c61d02ae003824ea4b19b753c'
                this.getOrders('12qyocayNF7Lv6C9qW4avxs2E7U41fKSfv','token.CCNY')
                // let to = this.currentAccount.address
                let mainUrl = this.currentMain.url
                let paraUrl = this.currentParallel.url
    
                if (privateKey === void 0) {
                    callback(JSON.stringify(this.PARA_ERROR.PARAM_ERROR))
                    return
                }
                if (amt <= 0) {
                    callback(JSON.stringify(this.PARA_ERROR.PARAM_ERROR))
                    return
                }
                this.mainCoins2Paracross(privateKey, amt, mainUrl,'token').then(hash1 => {
                    console.log('hash1')
                    console.log(hash1)
                    this.txStateCheckTask(hash1, mainUrl, err1 => {
    
                        if (err1) {
                            this.PARA_ERROR.B2G_COIN2PARA_ERROR.msg = err1
                            callback(JSON.stringify(this.PARA_ERROR.B2G_COIN2PARA_ERROR))
                            return
                        }
    
                        this.main2Parallel(privateKey, to, amt, mainUrl,'token').then(hash2 => {
                            console.log('hash2')
                            console.log(hash2)
                            this.txStateCheckTask(hash2, mainUrl, err2 => {
    
                                if (err2) {
                                    this.PARA_ERROR.B2G_PARA_ERROR.msg = err2
                                    callback(JSON.stringify(this.PARA_ERROR.B2G_PARA_ERROR))
                                    return
                                }
    
                                this.parallelPara2Coins(privateKey, amt, paraUrl,'token').then(hash3 => {
                                    console.log('hash3')
                                    console.log(hash3)
                                    this.txStateCheckTask(hash3, paraUrl, err3 => {
    
                                        if (err3) {
                                            this.PARA_ERROR.B2G_TRADE_ERROR.msg = err3
                                            callback(JSON.stringify(this.PARA_ERROR.B2G_TRADE_ERROR))
                                            return
                                        }
    
                                        callback(JSON.stringify({hash:hash3}))
                                    })
    
                                })
                            })
                        })
                    })
                })
            })
        },
        // CCNY平行链向主链
        ccnyParallel2Main(privateKey, amt, callback){
            window.chrome.runtime.getBackgroundPage(win=>{
                if(win&&win.currentAccount){
                    this.$store.commit('Account/UPDATE_CURRENTACCOUNT', win.currentAccount)
                }
                let to = ''
                if(win.currentAccount.address){
                    to = win.currentAccount.address
                }else{
                    to = this.currentAccount.address
                }
                this.BUY_ID = 'cf215c5e6a09f02b7049b545ddb6ea64d81fcdd0ecba5b92e973ef952e7e6489'
                this.getOrders('12qyocayNF7Lv6C9qW4avxs2E7U41fKSfv','CCNY')
                // let to = this.currentAccount.address
                let mainUrl = this.currentMain.url
                let paraUrl = this.currentParallel.url
    
                if (privateKey === void 0) {
                    callback(JSON.stringify(this.PARA_ERROR.PARAM_ERROR))
                    return
                }
                if (amt <= 0) {
                    callback(JSON.stringify(this.PARA_ERROR.PARAM_ERROR))
                    return
                }
                // 跨链兑换
                this.parallelCoins2Para(privateKey, amt, paraUrl,'token').then(hash1 => {
                    console.log('hash1')
                    console.log(hash1)
                    this.txStateCheckTask(hash1, paraUrl, err1 => {
                        console.log(err1)
                        if (err1) {
                            this.PARA_ERROR.G2B_TRADE_ERROR.msg = err1
                            callback(JSON.stringify(this.PARA_ERROR.G2B_TRADE_ERROR))
                            return
                        }
                        this.parallel2Main(privateKey, to, amt, paraUrl,'token').then(hash2 => {
                            console.log('hash2')
                            console.log(hash2)
                            this.mainParaBalanceCheckTask('token',to, (paraAmt, err2) => {
                                console.log(err2)
                                if(err2 && err2 == 'no times'){
                                    callback(JSON.stringify({desc:'errBlance',msg:'主链paracross余额不对。'}))
                                    return
                                }
                                if (err2) {
                                    this.PARA_ERROR.G2B_PARA_ERROR.msg = err2
                                    callback(JSON.stringify(this.PARA_ERROR.G2B_PARA_ERROR))
                                    return
                                }
    
                                this.mainParacross2Coins(privateKey, paraAmt, mainUrl,'token').then(hash3 => {
                                    console.log('hash3')
                                    console.log(hash3)
                                    this.txStateCheckTask(hash3, mainUrl, err3 => {
                                        if (err3) {
                                            this.PARA_ERROR.G2B_PARA2COIN_ERROR.msg = err3
                                            callback(JSON.stringify(this.PARA_ERROR.G2B_PARA2COIN_ERROR))
                                            return
                                        }
                                        callback(JSON.stringify({hash:hash3}))
    
                                    })
    
                                })
                            })
                        })
                    })
                })
            })
        },
        testCurrentMain(){
            console.log('---------this.currentAccount-----------')
            console.log(this.currentAccount)
        }
    },
    mounted() {

    }
}