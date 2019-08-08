<template>
    <div class="transfer_container">
        <asset-back title='BTY转账'></asset-back>
        <section class="content">
            <p><router-link :to="{ name: 'address'}">地址簿</router-link></p>
        </section>
    </div>
</template>

<script>
import AssetBack from '@/components/AssetBack.vue'
export default {
    components:{AssetBack},
}
</script>

<style lang='scss'>
.transfer_container{
    width: 100%;
    height: 100vh;
    background-image: url('../../../assets/images/anotherBg.png');
    background-size: 100% 100%;
}
</style>
