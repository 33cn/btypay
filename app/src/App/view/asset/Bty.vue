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
        <section class="records" >
            <ul>
                <li v-for="item in tab" :key="item.name" @click="view=item.com">{{item.name}}</li>
            </ul>
            <!-- <keep-alive>
                <component :is=""></component>
            </keep-alive> -->
            <div ref="txListWrap">
                <transition name="ani" mode="out-in">
                    <component :is="view"></component>
                </transition>
            </div>
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
            view:'All',
            pervScrollTop:0,
            nextIsLoading:false,
            loadingData:[]
        }
    },
    methods:{
        tabChange(item){
            this.view = item.com
        },
        onScroll(){
            console.log('scrolling')
            let scrollTop = this.$refs['txListWrap'].scrollTop
            let scrollBottom = this.$refs['txListWrap'].scrollHeight - scrollTop - this.$refs['txListWrap'].clientHeight
            if (this.pervScrollTop - scrollTop < 0) {
                // near the bottom
                if (scrollBottom <= 0 && !this.nextIsLoading) {
                    // do something
                    console.log('near')
                    let arr = [{time:'2222/22/22 22:22:22'},{time:'3333/33/33 33:33:33'}]
                    this.$store.commit('Records/LOADING_RECORDS',arr)
                }
            }
            this.pervScrollTop = scrollTop
        }
    },
    mounted () {
        this.$refs['txListWrap'].addEventListener('scroll', this.onScroll)
    },
    beforeDestroy(){
        this.$refs['txListWrap'].removeEventListener('scroll', this.onScroll)
    }
}
</script>

<style lang='scss'>
.bty_container{
    >section.records{
        overflow-x: hidden;
        width: 100%;
        // overflow-y: auto;
        // max-height: 445px;
        >ul{
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        >div{
            overflow-y: auto;
            max-height: 445px;
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
