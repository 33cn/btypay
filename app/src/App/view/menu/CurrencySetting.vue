<template>
    <div class="currency_container">
        <ul>
            <li v-for="(item,i) in currency" :key="i" @click="handle(item.name)">
                <p>{{item.name}}</p>
                <p v-if="item.name==coins">选中</p>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
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

    }
}
</script>
<style lang="scss">
div.currency_container{
    
}
</style>