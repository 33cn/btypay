<template>
    <div class="createWallet_container">
        <home-back></home-back>
        <ul class="content">
            <li>
                <p>请输入您额密码（8-16位字符）</p>
                <input type="text">
            </li>
            <li>
                <p>确认密码</p>
                <input type="text">
            </li>
        </ul>
        <p><router-link :to="{ name: 'WordsShow'}">创建</router-link></p>
    </div>
</template>

<script>
import HomeBack from '@/components/HomeBack.vue'
export default {
    components:{HomeBack}
}
</script>

<style lang='scss'>
.createWallet_container{

}
</style>
