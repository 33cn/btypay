<template>
    <div class="wordsConfirm_container">
        <home-back></home-back>
        <section class="content">
            <p class="desc">请按顺序确认您的助记词</p>
            <div></div>
            <div></div>
            <p class="btn"><router-link :to="{ name: 'WalletIndex'}">确认</router-link></p>
        </section>
    </div>
</template>

<script>
import HomeBack from '@/components/HomeBack.vue'
import { randomSort, addPropToArrElem } from '@/libs/common.js'
import {encrypt} from '@/libs/crypto.js'
export default {
    components:{HomeBack},
    data(){
        return{
            seedCharts:[],
            seedChartsRandom:[],
        }
    },
    methods:{
        //创建钱包
        createWallet(){
            // 省略各种判断
            this.saveSeed(this.seedString, 'password');

        },
        //保存加密助记词并创建钱包
        saveSeed(seedString,password){
            const walletObj = this.createHDWallet(seedString);
            // 加密助记词 
            let ciphertext = encrypt(seedString, password);
            // window.chrome.storage.local.set({ciphertext: ciphertext}, () => {})
            this.newAccount('创世地址');
            return walletObj;
        }
    },
    computed:{
        seedString(){
            return this.$store.state.Account.seed;
        }
    },
    mounted(){
        this.seedCharts = this.seedString.split(' ');
        this.seedChartsRandom = addPropToArrElem(randomSort(this.seedCharts), 'selected', false)
        this.createWallet()
    }
}
</script>

<style lang='scss'>
.wordsConfirm_container{

}
</style>
