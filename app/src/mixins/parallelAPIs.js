import chain33API from '@/mixins/chain33API'
import { createNamespacedHelpers } from 'vuex'
import { signRawTx, signGroupTx } from '@/libs/sign.js'
import Long from 'long'

const { mapState } = createNamespacedHelpers('Account')
export default{
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
        // 1.将CCNY转移到paracross执行器下（主链上的token转账）
        mainCcny2Paracorss(privateKey, amount, url){
            let params = {
                to:'1HPkPopVe3ERfvaAgedDtJQ792taZFEHCe',
                amount,
                fee:0.001*1e8,
                isToken:true,
                execName:'paracross',
                isWithdraw:false,
                tokenSymbol:'CCNY'
            }
            return this.createRawTransaction(params,url).then(tx => {
                return signRawTx(tx, privateKey)
            })
            .then(signedTx => {
                return this.sendTransaction(signedTx, url)
            })
        },
        // 2将paracorss下面的token跨到平行链上(token跨链，CCNY跨链)
        // 这里tokenSymbol作为标识符，当时bty跨链时默认空，token跨链的话，填代币名称
        paracorssCcny2Para(privateKey, to, amount, url){
            let params = {
                execer: 'user.p.issuance.paracross',//this.paraExecer,
                actionName: "ParacrossAssetTransfer",
                payload: {
                    execName: 'user.p.issuance.paracross',//this.paraExecer,
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
        // 3.将token.CCNY 转移到trade合约下面，按1比1比例和平行链上的CCNY进行兑换
        parallelCcny2Trade(amount, url){
            let params = {
                execer: 'user.p.issuance.paracross',//this.paraExecer,
                actionName: "TransferToExec",
                payload: {
                    execName: 'user.p.issuance.trade',//this.tradeExecer,
                    to: this.tradeAddr,//to地址是user.p.issuance.trade合约地址
                    amount: amount,
                    cointoken: "token.CCNY",
                    note:''
                }
            }
            return this.createTransaction(params, url)
        },
        // 将平行链上的CCNY转移到tade合约下
        parallelCcny(amount, url){
            let params = {
                execer: 'user.p.issuance.token',//this.paraExecer,
                actionName: "TransferToExec",
                payload: {
                    execName: 'user.p.issuance.trade',//this.tradeExecer,
                    to: this.tradeAddr,//to地址是user.p.issuance.trade合约地址
                    amount: amount,
                    cointoken: "token.CCNY",
                    note:''
                }
            }
            return this.createRawTransaction(params, url)
        },
        // 将平行链上的CCNY，挂个大卖单

        // 查看根据地址和状态查看卖单情况
        // 将主链上的CCNY兑换成平行链上的CCNY
        // 将兑换好的CCNY转移到借贷合约中
        // 将paracross 下面的token.CCNY 挂单卖出
        // 用平行链上的CCNY兑换跨链token.CCNY

        

        // 平行链上的跨链token.CCNY，跨回主链
        // 将token.CCNY 从trade转到paracross执行器下面
        parallelTrade2Paracross(amount, url){
            let params = {
                execer: 'user.p.issuance.paracross',//this.paraExecer,
                actionName: "Withdraw",
                payload: {
                    execName: 'user.p.issuance.trade',//this.tradeExecer,
                    to: this.tradeAddr,//to地址是user.p.issuance.trade合约地址
                    amount: amount,
                    cointoken: "token.CCNY",
                    note:''
                }
            }
            return this.createTransaction(params, url)
        },
        // 跨回主链,paracross执行器下
        paralleltoMainParacorss(amount, url){
            let params = {
                execer: 'user.p.issuance.paracross',//this.paraExecer,
                actionName: "ParacrossAssetTransfer",
                payload: {
                    execName: 'user.p.issuance.paracross',//this.tradeExecer,
                    to: this.tradeAddr,//to地址是user.p.issuance.trade合约地址
                    amount: amount,
                    // cointoken: "token.CCNY",
                    note:'',
                    isWithdraw:true,
                    tokenSymbol: "CCNY"
                }
            }
            return this.createTransaction(params, url)
        },
        // withdraw到token执行器下
        main2Token(privateKey, amount, url){
            let params = {
                to: this.paraAddr,
                amount: amount,
                fee:0.001*1e8,
                isToken:true,
                tokenSymbol:'CCNY',
                execName: "paracross",
                isWithdraw: true
            }
            return this.createRawTransaction(params, url).then(tx => {
                return signRawTx(tx, privateKey)
            }).then(signedTx => {
                return this.sendTransaction(signedTx, url)
            })
        }
    }
}