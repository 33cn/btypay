<template>
    <div class="bty_container">
        <asset-back title='BTY'></asset-back>
        <section class="balance">
            <div class="btn">
                <p><router-link :to="{ name: 'transfer'}">转账</router-link></p>
                <p><router-link :to="{ name: 'receipt'}">收款</router-link></p>
                <p><router-link :to="{ name: 'convert'}">兑换</router-link></p>
            </div>
        </section>
        <section class="records">
            <ul>
                <li v-for="item in tab" :key="item.name" @click="view=item.com">{{item.name}}</li>
            </ul>
            <!-- <keep-alive>
                <component :is=""></component>
            </keep-alive> -->
            <transition name="ani" mode="out-in">
                <component :is="view"></component>
            </transition>
        </section>
    </div>
</template>

<script>
import AssetBack from '@/components/AssetBack.vue'
import All from '@/App/view/asset/record/All.vue'
import Transfer from '@/App/view/asset/record/Transfer.vue'
import Receipt from '@/App/view/asset/record/Receipt.vue'
export default {
    components:{AssetBack,All,Transfer,Receipt},
    data(){
        return{
            tab:[{name:'全部',com:'All'},{name:'转账',com:'Transfer'},{name:'收款',com:'Receipt'},],
            view:'All'
        }
    },
    methods:{
        
    }
}
</script>

<style lang='scss'>
.bty_container{
    >section.records{
        >ul{
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
    }
    .ani-enter{
        transform: translateX(-100%);
    }
    .ani-enter-to{
        transform: translateX(0%);
    }
    .ani-enter-active,.ani-leave-active{
        transition: transform .3s ease;
    }
    .ani-leave{
        transform: translateX(0%);
    }
    .ani-leave-to{
        transform: translateX(100%);
    }
}
</style>
