<template>
    <div class="address_container" :class="addresses.length==0?'noAddress':'haveAddress'">
        <asset-back title='地址簿'></asset-back>
        <ul v-if="addresses.length>0">
            <li v-for="(item,i) in addresses" :key="i">
                <p>{{item.name}}</p>
                <p>{{item.address}}</p>
            </li>
        </ul>
        <div v-if="addresses.length==0" class="noAddress">
            <p>空空如也~</p>
            <p>快去添加您的地址吧</p>
        </div>
        <p><router-link :to="{ name: 'addAddress'}">添加地址</router-link></p>
    </div>
</template>

<script>
import AssetBack from '@/components/AssetBack.vue'
export default {
    components:{AssetBack},
    data(){
        return{
            addresses:[
                {name:'找币',address:'89fjindHkiqodnHjKjfjfkfkIICDINNkdn46eeeeeeejd'},
                {name:'找币',address:'89fjindHkiqodnHjKjfjfkfkIICDINNkdn46jd'},
                {name:'找币',address:'89fjindHkiqodnHjKjfjfkfkIICDINNkdn46jd'},
                {name:'找币',address:'89fjindHkiqodnHjKjfjfkfkIICDINNkdn46eeeeeeejd'},
                {name:'找币',address:'89fjindHkiqodnHjKjfjfkfkIICDINNkdn46jd'},
                {name:'找币',address:'89fjindHkiqodnHjKjfjfkfkIICDINNkdn46jd'},
                {name:'找币',address:'89fjindHkiqodnHjKjfjfkfkIICDINNkdn46eeeeeeejd'},
                {name:'找币',address:'89fjindHkiqodnHjKjfjfkfkIICDINNkdn46jd'},
                {name:'找币',address:'89fjindHkiqodnHjKjfjfkfkIICDINNkdn46jd'},
            ]
        }
    }
}
</script>

<style lang='scss'>
.address_container{
    width: 100%;
    height: 100vh;
    // background-image: url('../../../assets/images/lightColorBg.png');
    background-size: 100% 100%;
    &.noAddress{
        background-image: url('../../../assets/images/noAddress.png');
    }
    &.haveAddress{
        background-image: url('../../../assets/images/lightColorBg.png');
    }
    ul{
        margin: 51px 22px 0 26px;
        height: 370px;
        overflow-y: auto;
        li{
            margin: 0 50px 33px 0;
            p{
                line-height:1; 
                font-weight:400;
                font-family:MicrosoftYaHei;
                color:rgba(22,42,84,1);
                &:nth-of-type(1){
                    font-size:18px;
                    margin-bottom: 13px;
                }
                &:nth-of-type(2){
                    font-size:15px;
                    opacity:0.79;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
    >p{
        width: calc(100% - 49px);
        margin: 0 24.5px;
        background-image: url('../../../assets/images/addAddressBtn.png');
        background-size: 100% 100%;
        text-align: center;
        padding: 9px 0 14px;
        position: fixed;
        bottom: 107px;
        a{
            width: 100%;
            display: inline-block;
            font-size:20px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height:1;
        }
    }
    >div.noAddress{
        margin-top: 285px;
        p{
            text-align: center;
            font-size:18px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(96,151,255,1);
            line-height:1;
            &:nth-of-type(2){
                margin-top: 28px;
                color:rgba(22,42,84,1);
            }
        }
    }
}
</style>
