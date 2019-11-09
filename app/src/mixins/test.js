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
            return this.createRawTradeSellMarketTx([{ boardlotCnt, buyID }], url)
        },
        getTradeBuyOrder(url) {
            let params = {
                tokenSymbol: "coins.bty",
                status: this.TRADE_ORDER_STATUS.ON_BUY,
                count: "10000000"
            }
            return this.getTokenBuyOrderByStatus(params, url).then(res => {
                let maxAmt = Long.ZERO
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
                        if (minAmt.greaterThan("300000000")) {
                            continue
                        }
                        if (amountPerBoardlot.lessThan("100000") || amountPerBoardlot.greaterThan("300000000")) {
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
            let to = this.currentAccount.address
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
            this.mainCoins2Paracross(privateKey, amt, mainUrl).then(hash1 => {
                // console.log(hash1)
                this.txStateCheckTask(hash1, mainUrl, err1 => {

                    if (err1) {
                        this.PARA_ERROR.B2G_COIN2PARA_ERROR.msg = err1
                        callback(JSON.stringify(this.PARA_ERROR.B2G_COIN2PARA_ERROR))
                        return
                    }

                    this.main2Parallel(privateKey, to, amt, mainUrl).then(hash2 => {
                        this.txStateCheckTask(hash2, mainUrl, err2 => {

                            if (err2) {
                                this.PARA_ERROR.B2G_PARA_ERROR.msg = err2
                                callback(JSON.stringify(this.PARA_ERROR.B2G_PARA_ERROR))
                                return
                            }

                            this.parallelPara2Coins(privateKey, amt, paraUrl).then(hash3 => {
                                this.txStateCheckTask(hash3, paraUrl, err3 => {

                                    if (err3) {
                                        this.PARA_ERROR.B2G_TRADE_ERROR.msg = err3
                                        callback(JSON.stringify(this.PARA_ERROR.B2G_TRADE_ERROR))
                                        return
                                    }

                                    callback("success")
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
            return this.createRawTradeBuyMarketTx([{ sellID, boardlotCnt }], url);
        },
        getTradeSellOrder(url) {
            let params = {
                tokenSymbol: "coins.bty",
                status: this.TRADE_ORDER_STATUS.ON_SALE,
                count: "10000000"
            }
            return this.getTokenSellOrderByStatus(params, url).then(res => {
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
                        if (minAmt.greaterThan("300000000")) {
                            continue
                        }
                        if (pricePerBoardlot.lessThan("100000") || pricePerBoardlot.greaterThan("300000000")) {
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
                if (maxAmt.notEquals(Long.ZERO)) {
                    return "success"
                } else {
                    return JSON.stringify(this.PARA_ERROR.TRADE_SELL_NO_ORDER)
                }
            }).catch(err => {
                if (err.message === "ErrNotFound") {
                    return JSON.stringify(this.PARA_ERROR.TRADE_SELL_NO_ORDER)
                } else if (err.message === "ErrNotSupport") {
                    return JSON.stringify(this.PARA_ERROR.TRADE_CONTRACT_NOT_SUPPORT)
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
        transferGameCoin2BTY(privateKey, amt, callback) {
            let to = this.currentAccount.address
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
                this.txStateCheckTask(hash1, paraUrl, err1 => {

                    if (err1) {
                        this.PARA_ERROR.G2B_TRADE_ERROR.msg = err1
                        callback(JSON.stringify(this.PARA_ERROR.G2B_TRADE_ERROR))
                        return
                    }

                    this.parallel2Main(privateKey, to, amt, paraUrl).then(hash2 => {
                        this.mainParaBalanceCheckTask(to, (paraAmt, err2) => {

                            if (err2) {
                                this.PARA_ERROR.G2B_PARA_ERROR.msg = err2
                                callback(JSON.stringify(this.PARA_ERROR.G2B_PARA_ERROR))
                                return
                            }

                            this.mainParacross2Coins(privateKey, paraAmt, mainUrl).then(hash3 => {
                                this.txStateCheckTask(hash3, mainUrl, err3 => {

                                    if (err3) {
                                        this.PARA_ERROR.G2B_PARA2COIN_ERROR.msg = err3
                                        callback(JSON.stringify(this.PARA_ERROR.G2B_PARA2COIN_ERROR))
                                        return
                                    }
                                    callback("success")

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
                    if (res && res.receipt.ty === 2) {
                        callback()
                    } else {
                        let errMsg = ""
                        let errs = res.receipt.logs
                        for (let err of errs) {
                            if (err.ty === 1) {
                                errMsg = err.log
                            }
                        }
                        callback(errMsg)
                    }
                }).catch(err => {
                    if (err.message == "tx not exist" && times < 12) {
                        this.txStateCheckTask(hash, url, callback, ++times)
                    }
                })
            }, 5000);
        },

        mainParaBalanceCheckTask(addr, callback, times) {
            if (times === void 0) times = 0
            setTimeout(() => {
                this.getAddrBalance(addr, "paracross", this.currentMain.url).then(res => {
                    if (res[0].balance) {
                        callback(res[0].balance)
                    } else if (times < 12) {
                        this.mainParaBalanceCheckTask(addr, callback, ++times)
                    }
                }).catch(err => {
                    callback(0, err)
                })
            }, 5000);
        },

    },
    mounted() {

    }
}