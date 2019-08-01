<template>
    <div class="wordsShow_container">
        <home-back></home-back>
        <section class="content">
            <p>请记录下您的助记词，并妥善保存，建议通过纸笔的方式。不建议截图保存，会对您的资金安全造成威胁。</p>
            <div></div>
            <p><router-link :to="{ name: 'WordsConfirm'}">下一步</router-link></p>
        </section>
    </div>
</template>

<script>
import HomeBack from '@/components/HomeBack.vue'
import { randomSort, addPropToArrElem, getLocalLang } from '@/libs/common.js'
import {encrypt} from '@/libs/crypto.js'
export default {
    components:{HomeBack},
    data(){
        return{
            seedString:'',
            seedCharts:[],
        }
    },
    methods:{
        //生成助记词
        generateSeed(){
            this.seedString = this.newMnemonic(1);
            console.log(this.seedString)
            this.$store.commit('Account/UPDATE_SEED',this.seedString)
        },
        // //创建钱包
        // createWallet(){
        //     // 省略各种判断
        //     this.saveSeed(seedString, 'password');

        // },
        // //保存加密助记词并创建钱包
        // saveSeed(seedString,password){
        //     const walletObj = this.createHDWallet(seedString);
        //     // 加密助记词 
        //     let ciphertext = encrypt(seedString, password);
        //     window.chrome.storage.local.set({ciphertext: ciphertext}, () => {})
        //     // this.newAccount('创世地址');
        //     return walletObj;
        // }
    },
    computed:{

    },
    watch:{
        seedString(val){
            this.seedCharts = val.split(' ');
        },
        
    },
    mounted(){
        this.generateSeed();
    }
}
</script>

<style lang='scss'>
.wordsShow_container{

}
</style>
