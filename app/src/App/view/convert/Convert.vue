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
                <p>1BTY=1GANE</p>
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
                confirmButtonText: '知道了',
                closeOnClickModal:true,
                center:true,
                showClose:false,
                callback: action => {
                    this.$message({
                      type: 'info',
                      message: `action: ${ action }`
                    });
                }
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
        margin: 60px 24.5px 50px;
        display: flex;
        justify-content: space-between;
        >img{
            width: 32px;
            height: 24.5px;
            position: relative;
            top: 10px;
        }
        >div{
            display: flex;
            flex-direction: column;
            align-items: center;
            img{
                width: 47.5px;
            }
            p.coin{
                font-size:23px;
                font-family:MicrosoftYaHei;
                font-weight:bold;
                color:rgba(22,42,84,1);
                line-height:1;
                margin: 11.5px 0 30px;
            }
            input{
                width: calc(100% - 29px);
                padding: 6px 29px;
                border:1px solid rgba(22,42,84,0.61);
                font-size: 18px;
                // color:rgba(223,223,223,1);
                &::-webkit-input-placeholder { /* Chrome/Opera/Safari */ 
		        	color:rgba(223,223,223,1);
		        }
                // ::focus{
                //     border: 1px solid red;
                // }
            }
            p.balance{
                font-size:18px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(209,209,209,1);
                line-height: 1;
                margin-top: 10px;
            }
        }
    }
    section.desc{
        margin: 0 46px 0 39px;
        div{
            &:nth-of-type(2){
                margin: 21px 0 27px;
            }
            display: flex;
            justify-content: flex-start;
            align-items: center;
            p{
                font-size:20px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(22,42,84,1);
                line-height:1;
                &:nth-of-type(1){
                    width: 100px;
                    opacity:0.67;
                }
            }
        }
        >p{
            font-size:18px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(22,42,84,0.67);
            line-height:1;
        }
    }
    >p{
        margin: 56px 23px 0;
        background-image: url('../../../assets/images/longBtnBg.png');
        background-size: 100% 100%;
        text-align: center;
        padding: 9px 0 14px;
        font-size:20px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:1;
    }
}
</style>
