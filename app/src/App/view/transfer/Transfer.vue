<template>
    <div class="transfer_container">
        <asset-back title='BTY转账'></asset-back>
        <section class="content">
            <div>
                <p class="name">转账金额</p>
                <p class="balance">余额0.00BTY</p>
                <input type="text" placeholder="请输入金额">
            </div>
        </section>
        <p><router-link :to="{ name: 'address'}">地址簿</router-link></p>
    </div>
</template>

<script>
import AssetBack from '@/components/AssetBack.vue'
export default {
    components:{AssetBack},
}
</script>

<style lang='scss'>
.transfer_container{
    width: 100%;
    height: 100vh;
    background-image: url('../../../assets/images/lightColorBg.png');
    background-size: 100% 100%;
    section.content{
        margin: 70px 20.5px 0;
        >div{
            margin-bottom: 23.5px;
            position: relative;
            p{
                font-size:18px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(22,42,84,1);
                line-height:1;
                &.name{
                    margin-bottom: 13px;
                }
                &.balance{
                    opacity:0.53;
                    position: absolute;
                    top: 0px;
                    right: 0px;
                }
            }
            input{
                width: 100%;
            }
        }
    }
    >p{
        margin: 55px 23px 0;
        padding: 9px 0 14px;
        background-image: url('../../../assets/images/addAddressBtn.png');
        background-size: 100% 100%;
        text-align: center;
        a{
            font-size:20px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height:1;
        }
    }
}
</style>
