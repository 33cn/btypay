<template>
    <div class="detail_container">
        <asset-back title='订单详情' :backPath='"/coin?coin="+coin'></asset-back>
        <section class="status">
            <img v-if="recordDetail.typeTy==8" src="../../../../assets/images/fail.png" alt="">
            <img v-else src="../../../../assets/images/success.png" alt="">
            <p>{{recordDetail.typeTy==8?'转账失败':'转账成功'}}</p>
            <p>{{recordDetail.strTimeData}}</p>
        </section>
        <ul>
            <li>
                <p>金额</p>
                <p>{{recordDetail.strAmount}} BTY</p>
            </li>
            <li>
                <p>矿工费</p>
                <p>{{recordDetail.fee}} BTY</p>
            </li>
            <li>
                <p>付款地址</p>
                <p>{{recordDetail.strFromAddress}}<img @click="copyHandle($event, recordDetail.strFromAddress)" src="../../../../assets/images/copy.png"></p>
            </li>
            <li>
                <p>收款地址</p>
                <p>{{recordDetail.strToAddress}}<img @click="copyHandle($event, recordDetail.strToAddress)" src="../../../../assets/images/copy.png"></p>
            </li>
            <li>
                <p>区块</p>
                <p>{{recordDetail.height}}</p>
            </li>
            <li>
                <p>交易哈希</p>
                <p>{{recordDetail.hash}}<img @click="copyHandle($event, recordDetail.hash)" src="../../../../assets/images/copy.png"></p>
            </li>
        </ul>
    </div>
</template>

<script>
import AssetBack from '@/components/AssetBack.vue'
import {clip} from '@/libs/clip.js'
// import chain33API from "@/mixins/chain33API.js";
// import { TransactionsListEntry, formatTxType } from '@/libs/bitcoinAmount.js'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('Records')
// import recover from "@/mixins/recover.js";
export default {
    // mixins: [recover],
    components:{AssetBack},
    computed: {
        ...mapState(['recordDetail'])
    },
    // data(){
    //     return{
    //         detail:{}
    //     }
    // },
    methods:{
        copyHandle(event,text){
            clip({
                event,
                text,
                response: (err, msg) => {
                  if (err) {
                    this.$message.error(msg)
                    return
                  }
                  this.$message.success(msg)
                }
            })
        }
    },
    mounted(){
        this.coin = this.$store.state.Records.assetType;
        // console.log(this.recordDetail)
        // if(this.$route.params.hash){
        //     this.queryTransaction(this.$route.params.hash).then(res=>{
        //         console.log(res)
        //         this.detail = res;
        //     })
        // }
        // console.log(this.$route.params)
    }
}
</script>

<style lang='scss'>
.detail_container{
    width: 100%;
    height: 100vh;
    background-image: url('../../../../assets/images/lightColorBg.png');
    background-size: 100% 100%;
    >section.status{
        margin: 25px 0 46px;
        display: flex;
        flex-direction: column;
        align-items: center;
        img{
            width: 43px;
        }
        p{
            font-family:MicrosoftYaHei;
            font-weight:400;
            line-height: 1;
            &:nth-of-type(1){
                font-size:16px;
                color:rgba(22,42,84,1);
                margin: 23px 0 9px;
            }
            &:nth-of-type(2){
                font-size:14px;
                color:rgba(153,153,153,1);
            }
        }
    }
    >ul{
        margin: 0 50px;
        li{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            p{
                font-family:MicrosoftYaHei;
                font-weight:400;
                line-height: 1.3;
                color:rgba(22,42,84,1);
                &:nth-of-type(1){
                    width: 110px;
                    font-size: 14px;
                    line-height:3;
                    opacity:0.67;
                }
                &:nth-of-type(2){
                    font-size: 12px;
                    word-wrap:break-word;
                    word-break: break-all;
                    width: calc(100% - 110px);
                    flex-wrap: wrap;
                    position: relative;
                    img{
                        width: 17px;
                        margin: 0px 0 0 13px;
                        cursor: pointer;
                        position: absolute;
                    }
                }
            }
        }
    }
}
</style>
