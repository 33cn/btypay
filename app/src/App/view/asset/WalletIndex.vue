<template>
    <div class="walletIndex_container">
        <header>
            <p>B</p>
            <p><router-link :to="{ name: 'node'}">节点设置</router-link></p>
        </header>
        <section class="content">
            <p>我的资产</p>
            <ul>
                <li @click="toBty">BTY</li>
                <li @click="toGame">GAME</li>
            </ul>
        </section>
    </div>
</template>

<script>
export default {
    methods:{
        toBty(){
            this.$router.push({name:'bty'})
        },
        toGame(){
            this.$router.push({name:'gameCoin'})
        }
    }
}
</script>

<style lang='scss'>
.walletIndex_container{
    >header{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    >section.content{
        >p{
            padding: 10px;
        }
        ul{
            li{
                margin-bottom: 15px;
            }
        }
    }
}
</style>
