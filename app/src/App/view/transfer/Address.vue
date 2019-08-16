<template>
    <div class="address_container" :class="addresses.length==0?'noAddress':'haveAddress'">
        <asset-back title='地址簿'></asset-back>
        <ul v-if="addresses.length>0">
            <li v-for="(item,i) in addresses" :key="i" @click="selectedAddress(item.address)">
                <p>{{item.label}}</p>
                <p>{{item.address}}</p>
            </li>
        </ul>
        <div v-if="addresses.length==0" class="noAddress">
            
        </div>
        <p><router-link :to="{ name: 'addAddress'}">添加地址</router-link></p>
    </div>
</template>

<script>
import AssetBack from '@/components/AssetBack.vue'
import walletAPI from '@/mixins/walletAPI.js'
export default {
    mixins: [walletAPI],
    components:{AssetBack},
    data(){
        return{
            addresses:[
                // {label:'hhhh',address:'qsdfsdfsdfdsfsdfsdfsdfdsf'}
            ]
        }
    },
    methods:{
        selectedAddress(ad){
            console.log(ad)
            // this.$router.push({ path: "/coin?coin=bty" });
            this.$router.push({ path: "/coin/transfer?address="+ad })
        }
    },
    mounted(){
        this.getChromeStorage('address').then(res=>{
            // console.log(res)
            if(res.address){
                this.addresses = res.address;
            }
        })
    }
}
</script>

<style lang='scss'>
.address_container{
    width: 100%;
    height: 100vh;
    background-image: url('../../../assets/images/lightColorBg.png');
    background-size: 100% 100%;
    // &.noAddress{
    //     background-image: url('../../../assets/images/noAddress.png');
    // }
    // &.haveAddress{
    //     background-image: url('../../../assets/images/lightColorBg.png');
    // }
    ul{
        margin: 51px 43px 0 44px;
        height: 320px;
        overflow-y: auto;
        &::-webkit-scrollbar {
            width: 0px;
            height: 0px;
            background: transparent;
        }
        li{
            margin: 0 0px 33px 0;
            cursor: pointer;
            p{
                line-height:1; 
                font-weight:400;
                font-family:MicrosoftYaHei;
                color:rgba(22,42,84,1);
                &:nth-of-type(1){
                    font-size:18px;
                    margin-bottom: 14px;
                }
                &:nth-of-type(2){
                    font-size:16px;
                    opacity:0.79;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            &:nth-last-of-type(1){
                margin-bottom: 0px;
            }
        }
    }
    >p{
        width: calc(100% - 55px);
        margin: 0 26px 0 29px;
        background-image: url('../../../assets/images/longBtnBg.png');
        background-size: 100% 100%;
        text-align: center;
        padding: 12px 0 18px;
        position: fixed;
        bottom: 47px;
        a{
            width: 100%;
            display: inline-block;
            font-size:16px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height:1;
        }
    }
    >div.noAddress{
        width: 249px;
        height: 281px;
        margin: 30px auto 0;
        background-image: url('../../../assets/images/noAddress.png');
        background-size: 100% 100%;
    }
}
</style>
