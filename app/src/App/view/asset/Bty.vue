<template>
    <div class="bty_container">
        <header>
            <router-link :to="{ name: 'WalletIndex'}">fanhui</router-link>
            <p><router-link :to="{ name: 'node'}">节点设置</router-link></p>
        </header>
        <section class="balance">
            <img src="../../../assets/images/logo.png" alt="">
            <div class="balance">
                <p>0.00</p>
                <p>≈￥0.00</p>
            </div>
            <div class="address">
                <p>fdsfdsfdsfssfsfsdfsdffsfsfsffsfsfsfsdsf</p>
                <span>复制</span>
            </div>
        </section>
        <section class="btn">
            <p><router-link :to="{ name: 'transfer'}">转账</router-link></p>
            <p><router-link :to="{ name: 'receipt'}">收款</router-link></p>
            <p><router-link :to="{ name: 'convert'}">兑换</router-link></p>
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
import All from '@/App/view/asset/record/All.vue'
import Transfer from '@/App/view/asset/record/Transfer.vue'
import Receipt from '@/App/view/asset/record/Receipt.vue'
export default {
    components:{All,Transfer,Receipt},
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
    width: 100%;
    height: 100vh;
    background-image: url('../../../assets/images/assetOperateBg.png');
    background-size: 100% 100%;
    padding-top: 100px;
    position: relative;
    >header{
        margin: 0 29px 0 46px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 1000;
        position: relative;
        p{
            font-size:18px;
            font-family:MicrosoftYaHei-Bold;
            font-weight:bold;
            a{
                color:rgba(245,185,71,1);
            }
        }
    }
    >section.balance{
        // width: 100%;
        position: relative;
        // left: calc(50% - 32px);
        // top: 109px;
        top: -18px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        >img{
            width: 64px;
            height: 64px;
            margin-bottom: 29px;
        }
        div{
            display: flex;
            &.balance{
                flex-direction: column;
                align-items: center;
                p{
                    font-size:23px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    color:rgba(22,42,84,1);
                    line-height: 1;
                    &:nth-of-type(2){
                        margin-top: 6px;
                        font-size:20px; 
                        color:rgba(255,255,255,1);
                    }
                }
            }
            &.address{
                width: 222px;
                margin: 20px 0 0;
                justify-content: center;
                align-items: center;
                position: relative;
                
                p{
                    padding: 4px 13px 4px 16px;
                    background:rgba(255,255,255,1);
                    border-radius:7.5px;
                    font-size:15.5px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    color:rgba(22,42,84,1);
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                span{
                    width: 25px;
                    height: 25px;
                    display: inline-block;
                    position: absolute;
                    left: 238px;
                }
            }
        }
    }
    >section.btn{
        margin: 0 28px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p{
            width: 85px;
            height: 43.5px;
            text-align: center;
            background-size: 100% 100%;
            font-size:20px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            a{
                color:rgba(255,255,255,1);
            }
        }
    }
    >section.records{
        // width: 100%;
        // overflow-x: hidden;
        >ul{
            margin: 0 37px 0 31.5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size:20px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            li{
                color:rgba(33,123,244,1);
            }
            
        }
        >div{
            overflow-y: auto;
            max-height: 145px;
            /* 设置滚动条的样式 */
            &::-webkit-scrollbar {
              width: 0px;
              height: 0px;
              background: transparent;
            }
            // /* 滚动槽 */
            // &::-webkit-scrollbar-track {
            // //   border-radius: $--border-radius-base;
            //   background: transparent;
            // }
            // /* 滚动条滑块 */
            &::-webkit-scrollbar-thumb {
              background:red;
              border-radius:2px;
              opacity: 0.2;
            }
            // &::-webkit-scrollbar-thumb:window-inactive {
            //   background:rgba(74,125,180,.2);
            // //   border-radius:4px;
            //   opacity: 0.2;
            // }
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
