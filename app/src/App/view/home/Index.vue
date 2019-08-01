<template>
    <div class="index_container">
        <home-header></home-header>
        <section class="content">
            <router-view></router-view>
        </section>
    </div>
</template>

<script>
import HomeHeader from '@/components/HomeHeader.vue'
export default {
    components: { HomeHeader },
    mounted(){
        // this.$serverErrNotify('sdgjhkfghdkjf')
    }
}
</script>

<style lang='scss'>
    .index_container{

    }
</style>
