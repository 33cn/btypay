<template>
    <div class="ImportOrCreate_container">
        <p>您是新用户吗?</p>
        <ul>
            <li>
                <p class="desc">不是，我已经有比特元钱包了。</p>
                <p class="btn">
                    <router-link :to="{ name: 'ImportWallet'}">导入钱包</router-link>
                </p>
            </li>
            <li>
                <p class="desc">是，让我们赶紧开始吧。</p>
                <p class="btn">
                    <router-link :to="{ name: 'CreateWallet'}">创建钱包</router-link>
                </p>
            </li>
            <!-- <img src="../../../assets/images/tickets.png" alt=""> -->
        </ul>
    </div>
</template>

<script>
export default {

}
</script>

<style lang='scss'>
.ImportOrCreate_container{

}
</style>
