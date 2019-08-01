<template>
    <div class="node_container">
        <header>
            <p><router-link :to="{ name: 'WalletIndex'}">返回</router-link></p>
            <p>节点设置</p>
            <p>保存</p>
        </header>
        <ul>
            <li>
                <p>主链节点设置</p>
            </li>
            <li>
                <p>平行链节点设置</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {

}
</script>

<style lang='scss'>
.node_container{

}
</style>
