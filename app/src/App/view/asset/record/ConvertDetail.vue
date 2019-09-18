<template>
    <div class="convertDetail_container">
        <asset-back title='订单详情' :backPath='"/coin?coin="+coin'></asset-back>
        <section class="status">
            <img v-if="recordDetail.typeTy==8" src="../../../../assets/images/fail.png" alt="">
            <img v-else src="../../../../assets/images/success.png" alt="">
            <p>{{recordDetail.typeTy==8?'兑换失败':'兑换成功'}}</p>
            <p>{{recordDetail.strTimeData}}</p>
        </section>
        <ul>
            <li>
                <p>转出数量</p>
                <p>{{recordDetail.strAmount}}BTY</p>
            </li>
            <li>
                <p>收到数量</p>
                <p>{{recordDetail.strAmount | numFilter}}{{currentParallel.coin}}</p>
            </li>
            <li>
                <p>汇率</p>
                <p>1BTY=1{{currentParallel.coin}}</p>
            </li>
            <li>
                <p>矿工费</p>
                <p>{{recordDetail.fee | numFilter}}BTY</p>
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
import { createNamespacedHelpers } from 'vuex'
import recover from "@/mixins/recover.js";
const { mapState } = createNamespacedHelpers('Records')
export default {
    mixins:[recover],
    components:{AssetBack},
    computed: {
        ...mapState(['recordDetail']),
        parallelAsset(){
            return this.$store.state.Account.parallelAsset;
        }
    },
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
    filters: {
        numFilter(val) {
          if (val || val == 0) {
            let f = parseFloat(val),
              result = null;
            result = Math.floor(f * 10000) / 10000;
            return parseFloat(result).toFixed(4)
          }
        }
    },
    mounted(){
        // console.log(this.recordDetail)
        // console.log(this.$route.params);
    }
}
</script>

<style lang='scss'>
.convertDetail_container{
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
        margin: 0 55px 0 74px;
        li{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 17px;
            p{
                font-family:MicrosoftYaHei;
                font-weight:400;
                line-height: 1;
                color:rgba(22,42,84,1);
                &:nth-of-type(1){
                    width: 90px;
                    font-size: 14px;
                    // line-height:3;
                    opacity:0.67;
                }
                &:nth-of-type(2){
                    font-size: 12px;
                    word-wrap:break-word;
                    word-break: break-all;
                    width: calc(100% - 90px);
                    flex-wrap: wrap;
                    position: relative;
                    line-height: 16px;
                    img{
                        width: 17px;
                        margin: 0px 0 0 13px;
                        cursor: pointer;
                        position: absolute;
                    }
                }
            }
            &:nth-last-of-type(2){
                margin-bottom: 10px;
            }
        }
    }
}
</style>
