<template>
    <div class="convert_container">
        <asset-back title='兑换'></asset-back>
        <section class="ope">
            <div class="left">
                <img v-if="convert=='B2G'" src="../../../assets/images/btyLogo.png" alt="">
                <img v-else src="../../../assets/images/gameLogo.png" alt="">
                <p class="coin">{{convert=='B2G'?'BTY':'GAME'}}</p>
                <input :class="isInput?'error':''" v-model="exportVal" @input.prevent="inputHandle($event,'from')" type="number" placeholder="转出数量">
                <p class="balance">余额{{asset.amt}}{{convert=='B2G'?'BTY':'GAME'}}</p>
            </div>
            <img @click="exchangeHandle" src="../../../assets/images/exchange.png" alt="">
            <div class="right">
                <img v-if="convert=='B2G'" src="../../../assets/images/gameLogo.png" alt="">
                <img v-else src="../../../assets/images/btyLogo.png" alt="">
                <p class="coin">{{convert=='G2B'?'BTY':'GAME'}}</p>
                <input :class="isInput?'error':''" v-model="receiptVal" @input.prevent="inputHandle($event,'to')" type="number" placeholder="收到数量">
            </div>
        </section>
        <section class="desc">
            <div>
                <p>汇率</p>
                <p>1{{convert=='B2G'?'BTY':'GAME'}}=1{{convert=='G2B'?'BTY':'GAME'}}</p>
            </div>
            <div>
                <p>手续费</p>
                <p>0%</p>
            </div>
            <p>温馨提示：跨链兑换支持使用GAME兑换BTY，也可将GAME兑换成BTY。</p>
        </section>
        <p @click="convertHandle">跨链兑换</p>
    </div>
</template>

<script>
import AssetBack from '@/components/AssetBack.vue'
import walletAPI from '@/mixins/walletAPI.js'
import { createNamespacedHelpers } from "vuex";

const { mapState } = createNamespacedHelpers("Account");

export default {
    mixins: [walletAPI],
    components:{AssetBack},
    computed: {
        ...mapState([
        //   "accountMap",
        //   "currentAccount",
        //   "currentMain",
        //   "currentParallel",
          "mainAsset",
          "parallelAsset",
        //   "mainNode",
        //   "parallelNode"
        ])
    },
    data(){
        return{
            convert:'B2G',
            exportVal:null,
            receiptVal:null,
            isInput:false,
            asset:{
                amt:10.00
            },
            rate:2,//待删
        }
    },
    methods:{
        inputHandle(e,v){
            console.log(e.target.value)
            console.log(v)
            this.isInput = false;
            if(e.target.value < 0){
                this.exportVal = null;
                this.receiptVal = null;
                return
            }
            if(e.target.value == null || e.target.value == 0){
                this.receiptVal = null;
                this.exportVal = null
            }
            let val = null;
            if(v == 'to'){
                if(this.convert == 'B2G'){
                    val = this.asset.amt*this.rate;
                    console.log(val)
                    this.exportVal = this.receiptVal/2
                }else{
                    val = this.asset.amt/this.rate;
                    this.exportVal = this.receiptVal*2
                }
            }else{
                if(this.convert == 'B2G'){
                    this.receiptVal = this.exportVal*2;
                }else{
                    this.receiptVal = this.exportVal/2;
                }
                val = this.asset.amt;
                
            }
            if(e.target.value > val){
                this.isInput = true;
                this.$message.error('余额不足')
                setTimeout(() => {
                    this.exportVal = null;
                    this.receiptVal = null;
                    this.isInput = false;
                }, 500);
            }else{
                // this.exportVal = e.target.value;
                // this.receiptVal = e.target.value;
            }
        },
        convertHandle(){
            if(this.exportVal){
                this.$alert('请关注收款地址的资金变动。', '兑换成功', {
                    confirmButtonText: '确认',
                    closeOnClickModal:true,
                    center:true,
                    showClose:false,
                });
            }else{
                this.isInput = true;
                setTimeout(() => {
                    this.isInput = false;
                }, 3000);
                this.$message.error('请输入兑换数量')
            }
        },
        exchangeHandle(){
            if(this.convert == 'B2G'){
                this.convert = 'G2B';
                // this.asset = this.parallelAsset;
                return
            }else{
                this.convert = 'B2G'
                // this.asset = this.mainAsset;
            }
        }
    },
    mounted(){
        // this.refreshMainAsset();
        // this.refreshParallelAsset();
        // setTimeout(() => {
        //     this.asset = this.mainAsset;
        // }, 0);
    }
}
</script>

<style lang='scss'>
.convert_container{
    width: 100%;
    height: 100vh;
    background-image: url('../../../assets/images/lightColorBg.png');
    background-size: 100% 100%;
    section.ope{
        margin: 35px 44px 24px 55px;
        display: flex;
        justify-content: space-between;
        >img{
            width: 32px;
            height: 24px;
            position: relative;
            top: 13px;
            cursor: pointer;
        }
        >div{
            display: flex;
            flex-direction: column;
            align-items: center;
            img{
                width: 47px;
            }
            p.coin{
                font-size:18px;
                font-family:MicrosoftYaHei;
                font-weight:bold;
                color:rgba(22,42,84,1);
                line-height:1;
                margin: 7px 0 30px;
            }
            input{
                width: 100px;
                padding: 5px 11px 5px;
                border:1px solid rgba(22,42,84,0.61);
                font-size: 14px;
                font-family: MicrosoftYaHei;
                // color:rgba(223,223,223,1);
                &::-webkit-input-placeholder { /* Chrome/Opera/Safari */ 
		        	color:rgba(223,223,223,1);
		        }
                // ::focus{
                //     border: 1px solid red;
                // }
                &.error{
                    border:1px solid red;
                }
            }
            p.balance{
                font-size:12px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(209,209,209,1);
                line-height: 1;
                margin-top: 7px;
            }
        }
    }
    section.desc{
        margin: 0 56px 0 55px;
        div{
            &:nth-of-type(2){
                margin: 17px 0 20px;
            }
            display: flex;
            justify-content: flex-start;
            align-items: center;
            p{
                font-size:16px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(22,42,84,1);
                line-height:1;
                &:nth-of-type(1){
                    width: 130px;
                    opacity:0.67;
                }
            }
        }
        >p{
            font-size:16px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(22,42,84,0.67);
            line-height:24px;
        }
    }
    >p{
        margin: 55px 26px 0 29px;
        background-image: url('../../../assets/images/longBtnBg.png');
        background-size: 100% 100%;
        text-align: center;
        padding: 12px 0 18px;
        font-size:16px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:1;
        cursor: pointer;
    }
}
</style>
