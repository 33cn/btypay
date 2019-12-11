<template>
    <div class="currency_container">
        <asset-back title="货币设置" backPath="/WalletIndex"></asset-back>
        <ul>
            <li v-for="(item,i) in currency" :key="i" @click="handle(item.name)">
                <p>{{item.name}}</p>
                <img v-if="item.name==coins" src="../../../assets/images/selected.png" alt="">
                <!-- <p v-if="item.name==coins">选中</p> -->
            </li>
        </ul>
    </div>
</template>
<script>
import AssetBack from "@/components/AssetBack.vue";
import recover from "@/mixins/recover.js";
export default {
    mixins: [recover],
    components: { AssetBack },
    data(){
        return{
            currency:[
                {name:'CNY',selected:true},
                {name:'USD',selected:false}
            ]
        }
    },
    computed:{
        coins(){
            return this.$store.state.Account.currency;
        }
    },
    methods:{
        handle(val){
            this.$store.commit('Account/UPDATE_CURRENCY',val)
        }
    },
    mounted(){
        setChromeStorage('extensionStatus','').then(res=>{})
    }
}
</script>
<style lang="scss">
div.currency_container{
    width: 100%;
    height: 100vh;
    background-image: url("../../../assets/images/lightColorBg.png");
    background-size: 100% 100%;
    >ul{
        margin: 35px 85px 0 76px;
        li{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #A8B1BD;
            margin-bottom: 38px;
            padding: 0px 10px 0px 6px;
            cursor: pointer;
            p{
                font-size:16px;
                font-family:Microsoft YaHei;
                color:rgba(22,42,84,1);
                line-height: 50px;
            }
            img{
                width: 18px;
                height: 18px;
            }
        }
    }
}
</style>