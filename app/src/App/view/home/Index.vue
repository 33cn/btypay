<template>
    <div class="index_container">
        <home-header :isHidden=isHidden></home-header>
        <section class="content">
            <router-view></router-view>
        </section>
    </div>
</template>

<script>
import HomeHeader from '@/components/HomeHeader.vue'
export default {
    components: { HomeHeader },
    data(){
        return{
            isHidden:true
        }
    },
    mounted(){
        // this.$serverErrNotify('sdgjhkfghdkjf')
    },
    watch: {
        $route(to,from){
            // console.log(from.path)
            console.log('to.path==')
            console.log(to.path);
            if(to.path != '/'){
                this.isHidden = false;
            }else{
                this.isHidden = true;
            }
        }
    },
    beforeRouteEnter(to, from, next){
        next(vm=>{
            console.log('beforeRouteEnter')
            console.log(to)
            if(to.path != '/'){
                vm.isHidden = false;
            }else{
                vm.isHidden = true;
            }
        })
    }
}
</script>

<style lang='scss'>
    .index_container{

    }
</style>
