<template>
    <div class="detail_container">
        <asset-back title='订单详情'></asset-back>
    </div>
</template>

<script>
import AssetBack from '@/components/AssetBack.vue'
export default {
    components:{AssetBack},
    mounted(){
        console.log(this.$route.params)
    }
}
</script>

<style lang='scss'>
.detail_container{

}
</style>
