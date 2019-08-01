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

}
</style>
