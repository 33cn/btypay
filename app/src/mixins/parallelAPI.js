import chain33API from '@/mixins/chain33API'
import { createNamespacedHelpers } from 'vuex'
import { signRawTx, signGroupTx } from '@/libs/sign.js'
import Long from 'long'

const { mapState } = createNamespacedHelpers('Account')
// const buyId = "5f7a288651fea390c1cd0af6c2605b9e56d1297ede583d437b95e691cd758d42"
// const sellId = "4514d2d53fdfcf534241ff31886d78b8b81f41c2094783ffa321c91cfa21378a"


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
                TRADE_BUY_ORDER_NO_BALANCE: { val: 1, msg: "Trade合约中买单余额不足！" },
                TRADE_SELL_ORDER_NO_BALANCE: { val: 2, msg: "Trade合约中卖单余额不足！" }
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
            }

        }
    },
    methods: {
        // 主链bty从coins执行器转移到paracross执行器
        mainCoins2Paracross(privateKey, amount, url) {
            let params = {
                to: this.paraAddr,
                execName: "paracross",
                amount: amount
            }
            return this.createRawTransaction(params, url)
                .then(tx => {
                    return signRawTx(tx, privateKey)
                })
                .then(signedTx => {
                    return this.sendTransaction(signedTx, url)
                })
        },
        // 资产从主链转移到平行链（默认位于平行链的paracross执行器下）
        main2Parallel(privateKey, to, amount, url) {
            let params = {
                execer: this.paraExecer,
                actionName: "ParacrossAssetTransfer",
                payload: {
                    execName: this.paraExecer,
                    to: to,
                    amount: amount
                }
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
        parallelParacross2Trade(amount, url) {
            let params = {
                execer: this.paraExecer,
                actionName: "TransferToExec",
                payload: {
                    execName: this.tradeExecer,
                    to: this.tradeAddr,
                    amount: amount,
                    cointoken: "coins.bty"
                }
            }
            return this.createTransaction(params, url)
        },
        // 生成卖出指定买单的token的交易（未签名）
        parallelMarketSell(amt, url) {
            let boardlotCnt = Long.fromValue(amt).divide(this.BUY_LIMIT.amtPerBoardlot).toInt()
            let buyID = this.BUY_ID
            return this.createRawTradeSellMarketTx([{ boardlotCnt, buyID}], url)
        },
        getTradeBuyOrder(url) {
            let params = {
                tokenSymbol: "coins.bty",
                status: this.TRADE_ORDER_STATUS.ON_BUY,
                count: "10000000"
            }
            return this.getTokenBuyOrderByStatus(params, url).then(res => {
                if (res && res.orders.length !== 0) {
                    let maxAmt = Long.ZERO
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
                        if(minAmt.greaterThan("300000000")){
                            continue
                        }
                        if (amountPerBoardlot.greaterThan("300000000")) {
                            continue
                        }
                        if (leftAmt.greaterThan(maxAmt)) {
                            maxAmt = leftAmt
                            this.BUY_ID = order.txHash.replace(/^(0x|0X)/, '')
                            this.BUY_LIMIT.minAmt = minAmt.toString()
                            this.BUY_LIMIT.maxAmt = leftAmt.toString()
                            this.BUY_LIMIT.amtPerBoardlot = amountPerBoardlot.toString()
                        }
                    }
                }
            })
        },

        // 玩家获得的平行链主代币位于trade合约下，提币到coins合约
        parallelTrade2Coins(amount, url) {
            const execName = this.tradeExecer
            const isWithdraw = true
            let params = {
                to: this.tradeAddr,
                amount: amount,
                execName: execName,
                isWithdraw: isWithdraw
            }
            return this.createRawTransaction(params, url)
        },
        // 打包三笔交易
        parallelPara2Coins(privateKey, amount, url) {
            let txs = []
            return this.parallelParacross2Trade(amount, url).then(tx => {
                txs.push(tx)
                return this.parallelMarketSell(amount, url)
            }).then(tx => {
                txs.push(tx)
                return this.parallelTrade2Coins(amount, url)
            }).then(tx => {
                txs.push(tx)
                return this.createRawTxGroup(txs)
            }).then(tx => {
                return signGroupTx(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransaction(signedTx, url)
            })
        },

        // 余额从coins执行器转到dice合约,游戏币充值完成
        parallelCoins2Dice(privateKey, to, amount, fee) {
            const execName = this.diceExecer
            const isWithdraw = false
            return this.createRawTransactionWithExec(to, amount, fee, execName, isWithdraw).then(tx => {
                return signRawTx(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransaction(signedTx)
            })
        },

        txStateCheckTask(hash, url, callback) {
            setTimeout(() => {
                this.queryTx(hash, url).then(res => {
                    if (res && res.receipt.ty === 2) {
                        callback()
                    } else {
                        this.txStateCheckTask(hash, url, callback)
                    }
                }).catch(err => {
                    this.txStateCheckTask(hash, url, callback)
                })
            }, 5000);
        },

        transferBTY2GameCoin(privateKey, amt, callback) {
            const to = this.currentAccount.address
            let mainUrl = this.currentMain.url
            let paraUrl = this.currentParallel.url

            this.mainCoins2Paracross(privateKey, amt, mainUrl).then(hash1 => {
                this.txStateCheckTask(hash1, mainUrl, () => {
                    this.main2Parallel(privateKey, to, amt, mainUrl).then(hash2 => {
                        this.txStateCheckTask(hash2, mainUrl, () => {
                            this.parallelPara2Coins(privateKey, amt, paraUrl).then(hash3 => {
                                console.log(hash3)
                                callback("success")
                            }).catch(err => {
                                callback("xxx")
                                console.log(err)
                            })
                        })
                    })
                })
            })
        },


        mainParacross2Coins(privateKey, amount, url) {
            let params = {
                to: this.paraAddr,
                amount: amount,
                execName: "paracross",
                isWithdraw: true
            }
            return this.createRawTransaction(params, url).then(tx => {
                return signRawTx(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransaction(signedTx, url)
            })
        },
        parallel2Main(privateKey, to, amount, url) {
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
            return this.createTransaction(params, url).then(tx => {
                return signRawTx(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransaction(signedTx, url)
            })
        },
        parallelTrade2Paracross(amount, url) {
            let params = {
                execer: this.paraExecer,
                actionName: "Withdraw",
                payload: {
                    to: this.tradeAddr,
                    execName: this.tradeExecer,
                    amount: amount,
                    cointoken: "coins.bty"
                }
            }
            return this.createTransaction(params, url)
        },
        parallelMarketBuy(amt, url) {
            let boardlotCnt = Long.fromValue(amt).divide(this.SELL_LIMIT.pricePerBoardlot).toInt()
            let sellID = this.SELL_ID;
            return this.createRawTradeBuyMarketTx([{sellID, boardlotCnt}], url);
        },
        getTradeSellOrder(url){
            let params = {
                tokenSymbol: "coins.bty",
                status: this.TRADE_ORDER_STATUS.ON_SALE,
                count: "10000000"
            }
            return this.getTokenSellOrderByStatus(params, url).then(res => {
                if(res && res.orders.length !== 0){
                    let maxAmt = Long.ZERO;
                    for(let order of res.orders){
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
                        if(minAmt.greaterThan("300000000")){
                            continue
                        }
                        if (amountPerBoardlot.greaterThan("300000000")) {
                            continue
                        }
                        if (leftAmt.greaterThan(maxAmt)) {
                            maxAmt = leftAmt
                            this.SELL_ID = order.txHash.replace(/^(0x|0X)/, '')
                            this.SELL_LIMIT.minAmt = minAmt.toString()
                            this.SELL_LIMIT.maxAmt = leftAmt.toString()
                            this.SELL_LIMIT.pricePerBoardlot = pricePerBoardlot.toString()
                        }
                    }
                }
            })
        },
        parallelCoins2Trade(amount, url) {
            let params = {
                execName: this.tradeExecer,
                to: this.tradeAddr,
                amount: amount
            }
            return this.createRawTransaction(params, url)
        },
        // 打包交易组
        parallelCoins2Para(privateKey, amount, url) {
            console.log(amount)
            let txs = []
            return this.parallelCoins2Trade(amount, url).then(tx => {
                txs.push(tx)
                return this.parallelMarketBuy(amount, url)
            }).then(tx => {
                txs.push(tx)
                return this.parallelTrade2Paracross(amount, url)
            }).then(tx => {
                txs.push(tx)
                return this.createRawTxGroup(txs)
            }).then(tx => {
                return signGroupTx(tx, privateKey)
            }).then(signedTx => {
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
        transferGameCoin2BTY(privateKey, amount, callback) {
            const to = this.currentAccount.address
            let mainUrl = this.currentMain.url
            let paraUrl = this.currentParallel.url

            this.parallelCoins2Para(privateKey, amount, paraUrl).then(hash1 => {
                this.txStateCheckTask(hash1, paraUrl, () => {
                    this.parallel2Main(privateKey, to, amount, mainUrl).then(hash2 => {
                        this.txStateCheckTask(hash2, paraUrl, () => {
                            this.mainParacross2Coins(privateKey, amount, mainUrl).then(hash3 => {
                                console.log("hash3", hash3)
                                callback("success")
                            }).catch(err => {
                                console.log(err)
                            })
                        })
                    })
                })
            })
        },
    }
}