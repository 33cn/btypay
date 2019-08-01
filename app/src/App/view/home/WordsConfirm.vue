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
import { randomSort, addPropToArrElem, getLocalLang } from '@/libs/common.js'
export default {
    components:{HomeBack},
    data(){
        return{
            
            seedChartsRandom:[],
        }
    },
    computed:{
        seedCharts(){
            return this.$store.state.Account.seed;
        }
    },
    mounted(){
        console.log(this.seedCharts)
        this.seedChartsRandom = addPropToArrElem(randomSort(this.seedCharts), 'selected', false)
        console.log(this.seedChartsRandom)
    }
}
</script>

<style lang='scss'>
.wordsConfirm_container{

}
</style>
