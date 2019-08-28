import chain33API from '@/mixins/chain33API'
import { seed, sign } from '@33cn/wallet-base'
import { createNamespacedHelpers } from 'vuex'

import { signGroupTransaction } from '@/libs/sign.js'

const { mapState } = createNamespacedHelpers('Account')
// let isDev = process.env.NODE_ENV === 'development'

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
                    return sign.signRawTransaction(tx, privateKey)
                })
                .then(signedTx => {
                    return this.sendTransation(signedTx, url)
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
            return this.createTransaction(params, url).then(tx => {
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx, url)
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
            const to = this.currentAccount.address
            let mainUrl = this.currentMain.url
            let paraUrl = this.currentParallel.url

            let txs = []

            // return this.mainCoins2Paracross(privateKey, amount, mainUrl).then(res => {
            //     return this.main2Parallel(to, amount, paraUrl)
            // })
            // .then(tx => {
            //     txs.push(tx)
            //     return this.parallelParacross2Trade(amount, paraUrl)
            // })
            // .then(tx => {
            //     txs.push(tx)
            //     return this.parallelMarketSell(amount, paraUrl)
            // })
            // .then(tx => {
            //     txs.push(tx)
            //     return this.parallelTrade2Coins(amount, paraUrl)
            // })
            // .then(tx => {
            //     txs.push(tx)
            //     return this.createRawTxGroup(txs)
            // })
            // .then(tx => {
            //     return sign.signRawTransaction(tx, privateKey)
            // })
            // .then(signedTx => {
            //     console.log(signedTx)
            //     setTimeout(() => {
            //         this.sendTransation(signedTx, paraUrl).then(hash => {
            //             console.log(hash)
            //         })
            //     }, 5000);
            // })

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
            //                     return signGroupTransaction(tx, privateKey)
            //                 })
            //                 .then(signedTx => {
            //                     console.log(signedTx)
            //                     setTimeout(() => {
            //                         this.sendTransation(signedTx, paraUrl).then(hash => {
            //                             console.log(hash)
            //                         })
            //                     }, 5000);
            //                 })
            //         })
            //     }, 5000);
            // })

            let tx = "0a18757365722e702e676274746573742e7061726163726f7373124e1004424a0a09636f696e732e62747910c096b1022214757365722e702e676274746573742e74726164652a22313534536a476152757975574b61417370724c6b786d78363972316f75624168447820e0a71230e4bfdcbdb8e2a69b233a2131787a56624c4e796e77444e4c6a504e46387a765866627967517646635a47346140034aee040ae1010a18757365722e702e676274746573742e7061726163726f7373124e1004424a0a09636f696e732e62747910c096b1022214757365722e702e676274746573742e74726164652a22313534536a476152757975574b61417370724c6b786d78363972316f75624168447820e0a71230e4bfdcbdb8e2a69b233a2131787a56624c4e796e77444e4c6a504e46387a765866627967517646635a47346140034a20a67e6db679833899271c42717e43b059418617cf13c79f38bca8f527ed656a4d5220e323b650ee0348ff49da9418fd08ac42e6791fe416b026da00cc3514db5488c10ad7010a14757365722e702e676274746573742e7472616465124b200332470a403566376132383836353166656133393063316364306166366332363035623965353664313239376564653538336434333762393565363931636437353864343210c096b10230fb9083cedfbe8dd16b3a22313534536a476152757975574b61417370724c6b786d78363972316f75624168447840034a20a67e6db679833899271c42717e43b059418617cf13c79f38bca8f527ed656a4d522050a646281100951ede6955b8e2fa1347407e18d7391fe181123cd410bd58f6db0aad010a14757365722e702e676274746573742e636f696e7312431803223f10c096b1022214757365722e702e676274746573742e74726164652a22313534536a476152757975574b61417370724c6b786d78363972316f75624168447830c2f4b4fafbd7f3aa363a2231336f477554316357484b51596e4475454e617435506672787467576f774e5a6d6140034a20a67e6db679833899271c42717e43b059418617cf13c79f38bca8f527ed656a4d5220e323b650ee0348ff49da9418fd08ac42e6791fe416b026da00cc3514db5488c1"
            let signedTx = signGroupTransaction(tx, privateKey)
            this.sendTransation(signedTx, paraUrl).then(hash => {
                console.log(hash)
            })


            // return this.mainCoins2Paracross(privateKey, amount, mainUrl).then(res => {
            //     console.log(res)
            // })

            // return this.main2Parallel(to, amount, mainUrl).then(tx => {
            //     return sign.signRawTransaction(tx, privateKey)
            // }).then(signedTx => {
            //     return this.sendTransation(signedTx, paraUrl)
            // }).then(res => {
            //     console.log(res)
            // })

            // return this.parallelParacross2Trade(amount, paraUrl).then(tx => {
            //     return sign.signRawTransaction(tx, privateKey)
            // }).then(signedTx => {
            //     return this.sendTransation(signedTx, paraUrl)
            // }).then(res => {
            //     console.log(res)
            // })

            // return this.parallelMarketSell(amount, paraUrl).then(tx => {
            //     return sign.signRawTransaction(tx, privateKey)
            // }).then(signedTx => {
            //     return this.sendTransation(signedTx, paraUrl)
            // }).then(res => {
            //     console.log(res)
            // })

            // return this.parallelTrade2Coins(amount, paraUrl).then(tx => {
            //     return sign.signRawTransaction(tx, privateKey)
            // }).then(signedTx => {
            //     return this.sendTransation(signedTx, paraUrl)
            // }).then(res => {
            //     console.log(res)
            // })

            // -----
            // return this.parallelCoins2Trade(amount, paraUrl).then(tx => {
            //     return sign.signRawTransaction(tx, privateKey)
            // }).then(signedTx => {
            //     return this.sendTransation(signedTx, paraUrl)
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
            //     return sign.signRawTransaction(tx, privateKey)
            // }).then(signedTx => {
            //     return this.sendTransation(signedTx, paraUrl)
            // }).then(res => {
            //     console.log(res)
            // })

            // 撤销买单
            // return this.$chain33Sdk.createRawTradeRevokeBuyTx("67d2ef4f3e3d3711177bdf0d68d66043c69da183e03854f3784929bbac3dcafd", 0.001 * 1e8, paraUrl).then(tx => {
            //     return sign.signRawTransaction(tx, privateKey)
            // }).then(signedTx => {
            //     return this.sendTransation(signedTx, paraUrl)
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
        parallelCoins2Trade(amount, url) {
            let params = {
                execName: "user.p.gbttest.trade",
                to: tradeAddr,
                amount: amount
            }
            return this.createRawTransaction(params, url)
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
                return sign.signRawTransaction(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransation(signedTx)
            })
        }

    }
}