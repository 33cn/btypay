<template>
    <div class="about_container">
        <asset-back title="关于" backPath="/WalletIndex"></asset-back>
    </div>
</template>
<script>
import AssetBack from "@/components/AssetBack.vue";
export default {
    components: { AssetBack },
    data(){
        return{

        }
    },
    mounted(){

    }
}
</script>
<style lang="scss">
div.about_container{
    width: 100%;
    height: 100vh;
    background-image: url("../../../assets/images/lightColorBg.png");
    background-size: 100% 100%;
}
</style>