<template>
    <div class="bty_container">
        <header>
            <router-link :to="{ name: 'WalletIndex'}"><img src="../../../assets/images/back.png" alt=""></router-link>
            <p v-if="coin=='game'"><router-link :to="{ name: 'node'}">节点设置</router-link></p>
        </header>
        <section class="balance">
            <img src="../../../assets/images/logo.png" alt="">
            <div class="balance">
                <p>0.00</p>
                <p>≈￥0.00</p>
            </div>
            <div class="address">
                <p>fdsfdsfdsfssfsfsdfsdffsfsfsffsfsfsfsdsf</p>
                <img src="../../../assets/images/copy.png" alt="">
            </div>
        </section>
        <section :class="coin=='bty'?'btn bty':'btn game'">
            <p><router-link :to="{ name: 'transfer'}">转账</router-link></p>
            <p><router-link :to="{ name: 'receipt'}">收款</router-link></p>
            <p v-if="coin=='game'"><router-link :to="{ name: 'convert'}">兑换</router-link></p>
        </section>
        <section class="records" >
            <ul>
                <li v-for="(item,i) in tab" :key="item.name" @click="tabChange(item,i)">{{item.name}}</li>
                <li v-if="coin=='game'" @click="tabChange({name:'兑换',com:'Convert'},3)">兑换</li>
            </ul>
            <div class="line" ref="line" :style="{left:toLeft}"></div>
            <!-- <keep-alive>
                <component :is=""></component>
            </keep-alive> -->
            <div ref="txListWrap" class="history">
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
import Convert from '@/App/view/asset/record/Convert.vue'
export default {
    components:{All,Transfer,Receipt,Convert},
    data(){
        return{
            tab:[{name:'全部',com:'All'},{name:'转账',com:'Transfer'},{name:'收款',com:'Receipt'}],
            view:'All',
            preIndex:0,
            pervScrollTop:0,
            nextIsLoading:false,
            loadingData:[],
            coin:'',
            toLeft: null,
        }
    },
    methods:{
        tabChange(item,i){
            this.view = item.com;
            let length,
                differ = i - this.preIndex;
            if(this.coin == 'game'){
                length = 97*differ;
            }else if(this.coin == 'bty'){
                length = 145.5*differ;
            }
            this.toLeft = this.$refs.line.offsetLeft + length + 'px';
            setTimeout(() => {
                this.preIndex = i;
            }, 300);
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
    computed:{
        tabIndex(){
            // return this.view=='All'?
        }
    },
    mounted () {
        this.coin = this.$route.query.coin;
        this.$refs['txListWrap'].addEventListener('scroll', this.onScroll)
        // console.log(this.$route.query.coin)
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
    padding-top: 80px;
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
        img{
            width: 30.5px;
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
            width: 60px;
            height: 60px;
            margin-bottom: 20px;
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
                width: 230px;
                margin: 18px 0 0;
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
                img{
                    width: 25px;
                    height: 25px;
                    position: absolute;
                    left: 245px;
                }
            }
        }
    }
    >section.btn{
        display: flex;
        justify-content: space-between;
        align-items: center;
        p{
            width: 116px;
            height: 43.5px;
            text-align: center;
            background-size: 100% 100%;
            font-size:20px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            background-image: url('../../../assets/images/transferBtnBg.png');
            background-size: 100% 100%;
            padding-top: 3px;
            a{
                color:rgba(255,255,255,1);
            }
        }
        &.game{
            margin: 0 28px;
            p{
                width: 86.5px;
            }
        }
        &.bty{
            margin: 0 40.5px;
            p{
                width: 116px;
            }
        }
    }
    >section.records{
        // width: 100%;
        // overflow-x: hidden;
        // background-color: #fff;
        margin-top: 30px;
        position: relative;
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
        >div.line{
            width:20px;
            height:2px;
            border:1px solid rgba(245,185,71,1);
            background:linear-gradient(90deg,rgba(115,248,253,1),rgba(128,164,253,1));
            position: absolute;
            top: 30px;
            left: 32px;
            transition: all 0.3s linear;
        }
        >div.history{
            overflow-y: auto;
            max-height: 320px;
            margin-top: 8px;
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
