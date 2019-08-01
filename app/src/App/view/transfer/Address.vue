<template>
    <div class="address_container">
        <asset-back title='地址簿'></asset-back>
        <section class="content">
            <p><router-link :to="{ name: 'addAddress'}">添加地址</router-link></p>
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
.address_container{

}
</style>
