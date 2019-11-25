<template>
    <div class="dapps_container">
        <p>DAPP</p>
        <asset-back title="" backPath="/WalletIndex"></asset-back>
        <ul>
            <li v-for="(item,i) in dapps" :key="i">
                <p>{{item.name}}</p>
                <a :href="item.target"><img :src='"../../../assets/images/"+item.img+".png"' alt=""></a>
            </li>
        </ul>
    </div>
</template>
<script>
import AssetBack from "@/components/AssetBack.vue";
export default {
    components: { AssetBack },
    data(){
        return{
            dapps:[
                {name:'时时彩',img:'shishicai',traget:''},
                {name:'BTY抵押借贷',img:'jiedai',traget:''},
            ]
        }
    }
}
</script>
<style lang="scss">
div.dapps_container{
    width: 100%;
    height: 100vh;
    background-image: url("../../../assets/images/lightColorBg.png");
    background-size: 100% 100%;
    >p{
        width: 100%;
        text-align: center;
        font-size:30px;
        font-family:Consolas;
        font-weight:400;
        color:rgba(18,64,160,1);
        position: absolute;
        top: 41px;
    }
    >ul{
        margin: 0px 38px 0;
        li{
            p{
                margin: 24px 0 11px 11px;
                font-size:16px;
                font-family:Microsoft YaHei;
                color:rgba(22,42,84,1);
            }
            a{
                display: inline-block;
                width: 100%;
                height: 138px;
            }
        }
    }
}
</style>