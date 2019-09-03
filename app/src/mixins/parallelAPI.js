import chain33API from '@/mixins/chain33API'
import { createNamespacedHelpers } from 'vuex'
import { signRawTx, signGroupTx } from '@/libs/sign.js'

const { mapState } = createNamespacedHelpers('Account')
const paracrossAddr = "1HPkPopVe3ERfvaAgedDtJQ792taZFEHCe"
const tradeAddr = "154SjGaRuyuWKaAsprLkxmx69r1oubAhDx"
const buyId = "5f7a288651fea390c1cd0af6c2605b9e56d1297ede583d437b95e691cd758d42"
const sellId = ""


export default {
    mixins: [chain33API],
    computed: {
        ...mapState(['accountMap', 'currentAccount', 'currentMain', 'currentParallel'])
    },
    methods: {
        // 主链bty从coins执行器转移到paracross执行器
        mainCoins2Paracross(privateKey, amount, url) {
            let params = {
                to: paracrossAddr,
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
                execer: "user.p.gbttest.paracross",
                actionName: "ParacrossAssetTransfer",
                payload: {
                    execName: "user.p.gbttest.paracross",
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
                execer: "user.p.gbttest.paracross",
                actionName: "TransferToExec",
                payload: {
                    execName: "user.p.gbttest.trade",
                    to: tradeAddr,
                    amount: amount,
                    cointoken: "coins.bty"
                }
            }
            return this.createTransaction(params, url)
        },
        // 生成卖出指定买单的token的交易（未签名）
        parallelMarketSell(boardlotCnt, url) {
            return this.createRawTradeSellMarketTx(buyId, boardlotCnt, 0.001 * 1e8, url);
        },
        // 玩家获得的平行链主代币位于trade合约下，提币到coins合约
        parallelTrade2Coins(amount, url) {
            const execName = "user.p.gbttest.trade"
            const isWithdraw = true
            let params = {
                to: tradeAddr,
                amount: amount,
                execName: execName,
                isWithdraw: isWithdraw
            }
            return this.createRawTransaction(params, url)
        },
        // 打包三笔交易
        parallelPara2Coins(privateKey, amount, url){
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
            const execName = "user.p.gbttest.user.wasm.dice"
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
                    if(res && res.receipt.ty === 2){
                        callback()
                    } else {
                        this.txStateTask(hash, url, callback, param)
                    }
                })
            }, 5000);
        },

        transferBTY2GameCoin(privateKey, amount) {
            const to = this.currentAccount.address
            let mainUrl = this.currentMain.url
            let paraUrl = this.currentParallel.url

            this.mainCoins2Paracross(privateKey, amount, mainUrl).then(hash1 => {
                this.txStateCheckTask(hash1, mainUrl, () => {
                    this.main2Parallel(privateKey, to, amount, mainUrl).then(hash2 => {
                        this.txStateCheckTask(hash2, mainUrl, () => {
                            this.parallelPara2Coins(privateKey, amount, paraUrl).then(hash3 => {
                                console.log(hash3)
                            })
                        })
                    })
                })
            })


            // this.mainCoins2Paracross(privateKey, amount, mainUrl).then(res => {
            //     setTimeout(() => {
            //         this.main2Parallel(privateKey, to, amount, paraUrl).then(res => {
            //             let txs = []
            //             this.parallelParacross2Trade(amount, paraUrl)
            //                 .then(tx => {
            //                     txs.push(tx)
            //                     return this.parallelMarketSell(amount, paraUrl)
            //                 })
            //                 .then(tx => {
            //                     txs.push(tx)
            //                     return this.parallelTrade2Coins(amount, paraUrl)
            //                 })
            //                 .then(tx => {
            //                     txs.push(tx)
            //                     return this.createRawTxGroup(txs)
            //                 })
            //                 .then(tx => {
            //                     console.log(tx)
            //                     return signGroupTx(tx, privateKey)
            //                 })
            //                 .then(signedTx => {
            //                     console.log(signedTx)
            //                     setTimeout(() => {
            //                         this.sendTransaction(signedTx, paraUrl).then(hash => {
            //                             console.log(hash)
            //                         })
            //                     }, 5000);
            //                 })
            //         })
            //     }, 5000);
            // })

            // return this.main2Parallel(to, amount, mainUrl).then(tx => {
            //     return signRawTx(tx, privateKey)
            // }).then(signedTx => {
            //     return this.sendTransaction(signedTx, paraUrl)
            // }).then(res => {
            //     console.log(res)
            // })

            // return this.parallelParacross2Trade(amount, paraUrl).then(tx => {
            //     return signRawTx(tx, privateKey)
            // }).then(signedTx => {
            //     return this.sendTransaction(signedTx, paraUrl)
            // }).then(res => {
            //     console.log(res)
            // })

            // return this.parallelMarketSell(amount, paraUrl).then(tx => {
            //     return signRawTx(tx, privateKey)
            // }).then(signedTx => {
            //     return this.sendTransaction(signedTx, paraUrl)
            // }).then(res => {
            //     console.log(res)
            // })

            // return this.parallelTrade2Coins(amount, paraUrl).then(tx => {
            //     return signRawTx(tx, privateKey)
            // }).then(signedTx => {
            //     return this.sendTransaction(signedTx, paraUrl)
            // }).then(res => {
            //     console.log(res)
            // })

            // -----
            // return this.parallelCoins2Trade(amount, paraUrl).then(tx => {
            //     return signRawTx(tx, privateKey)
            // }).then(signedTx => {
            //     return this.sendTransaction(signedTx, paraUrl)
            // }).then(res => {
            //     console.log(res)
            // })


            // 挂大买单
            // let params = {
            //     tokenSymbol: "coins.bty", 
            //     amountPerBoardlot: 1, 
            //     minBoardlot: 1, 
            //     pricePerBoardlot: 1,
            //     totalBoardlot: amount, 
            //     assetExec: "paracross"
            // }
            // return this.$chain33Sdk.createRawTradeBuyLimitTx(params, paraUrl).then(tx => {
            //     return signRawTx(tx, privateKey)
            // }).then(signedTx => {
            //     return this.sendTransaction(signedTx, paraUrl)
            // }).then(res => {
            //     console.log(res)
            // })

            // 撤销买单
            // return this.$chain33Sdk.createRawTradeRevokeBuyTx("67d2ef4f3e3d3711177bdf0d68d66043c69da183e03854f3784929bbac3dcafd", 0.001 * 1e8, paraUrl).then(tx => {
            //     return signRawTx(tx, privateKey)
            // }).then(signedTx => {
            //     return this.sendTransaction(signedTx, paraUrl)
            // }).then(res => {
            //     console.log(res)
            // })

            // 查询买单
            // return this.$chain33Sdk.getOnesBuyOrder(to, ["coins.bty"], paraUrl).then(res => {
            //     console.log(res)
            // })

        },


        mainParacross2Coins(privateKey, amount, fee, note = '') {
            const to = "1HPkPopVe3ERfvaAgedDtJQ792taZFEHCe"
            // const to = '1NN5DQHp5goSLLFe6BhfL8DKALoCNuR9PT'
            return this.createRawTransaction(to, amount, fee, note).then(tx => {
                return signRawTx(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransaction(signedTx)
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
        parallelCoins2Trade(amount, url) {
            let params = {
                execName: "user.p.gbttest.trade",
                to: tradeAddr,
                amount: amount
            }
            return this.createRawTransaction(params, url)
        },
        parallelCoins2Para(){
            
        },
        parallelDice2Coins(privateKey, to, amount, fee) {
            const execName = "user.p.gbttest.user.wasm.dice"
            const isWithdraw = true
            return this.createRawTransactionWithExec(to, amount, fee, execName, isWithdraw).then(tx => {
                return signRawTx(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransaction(signedTx)
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
        transferGameCoin2BTY1(privateKey, amount) {
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
            }).then((res) => {
                console.log(res)
                arr.push(res)
                return this.mainParacross2Coins(privateKey, amount, fee)
            }).then(() => {
                return this.CreateRawTxGroup(arr)
            }).then(tx => {
                return signRawTx(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransaction(signedTx)
            })
        }

    }
}