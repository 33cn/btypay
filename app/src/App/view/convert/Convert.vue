<template>
    <div class="convert_container">
        <asset-back title='兑换'></asset-back>
        <section class="ope">
            <div class="left">
                <img v-if="convert=='B2G'" src="../../../assets/images/btyLogo.png" alt="">
                <img v-else src="../../../assets/images/gameLogo.png" alt="">
                <p class="coin">{{convert=='B2G'?'BTY':'GAME'}}</p>
                <input v-model="exportVal" @input.prevent="inputHandle" data-type='111' type="number" placeholder="转出数量">
                <p class="balance">余额0.00{{convert=='B2G'?'BTY':'GAME'}}</p>
            </div>
            <img @click="convert=='B2G'?convert='G2B':convert='B2G'" src="../../../assets/images/exchange.png" alt="">
            <div class="right">
                <img v-if="convert=='B2G'" src="../../../assets/images/gameLogo.png" alt="">
                <img v-else src="../../../assets/images/btyLogo.png" alt="">
                <p class="coin">{{convert=='G2B'?'BTY':'GAME'}}</p>
                <input v-model="receiptVal" @input.prevent="inputHandle" type="number" placeholder="收到数量">
            </div>
        </section>
        <section class="desc">
            <div>
                <p>汇率</p>
                <p>1BTY=1GAME</p>
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
export default {
    components:{AssetBack},
    data(){
        return{
            convert:'B2G',
            exportVal:null,
            receiptVal:null,
            rate:2,//待删
        }
    },
    methods:{
        inputHandle(e){
            console.log(e)
            this.exportVal = e.target.value;
            this.receiptVal = e.target.value;
        },
        convertHandle(){
            this.$alert('请关注收款地址的资金变动。', '兑换成功', {
                confirmButtonText: '确认',
                closeOnClickModal:true,
                center:true,
                showClose:false,
            });
        }
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
