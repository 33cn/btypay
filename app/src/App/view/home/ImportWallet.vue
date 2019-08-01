<template>
    <div class="importWallet_container">
        <home-back></home-back>
        <section class="content">
            <div class="words">
                <p>请输入您12位钱包助记词</p>
                <div>

                </div>
            </div>
            <ul class="password">
                <li>
                    <p>新密码（8-16位字符）</p>
                    <input type="text">
                </li>
                <li>
                    <p>确认密码</p>
                    <input type="text">
                </li>
            </ul>
            <p>
                <router-link :to="{ name: 'WalletIndex'}">导入</router-link>
            </p>
        </section>
    </div>
</template>

<script>
import HomeBack from '@/components/HomeBack.vue'
export default {
    components:{HomeBack}
}
</script>

<style lang='scss'>
.importWallet_container{

}
</style>
