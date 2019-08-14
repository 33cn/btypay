<template>
    <div class="detail_container">
        <asset-back title='订单详情'></asset-back>
        <section class="status">
            <!-- <img src="../../../../assets/images/success.png" alt=""> -->
            <img src="../../../../assets/images/fail.png" alt="">
            <p>转账失败</p>
            <p>2019/02/21 10:12:12</p>
        </section>
        <ul>
            <li>
                <p>金额</p>
                <p>100 BTY</p>
            </li>
            <li>
                <p>矿工费</p>
                <p>100 BTY</p>
            </li>
            <li>
                <p>付款地址</p>
                <p>1NkjfHkiqodnHjKjfjfkfkIICDINN46Jjf<img @click="copyHandle($event, 'currentAccount.payAddress')" src="../../../../assets/images/copy.png"></p>
            </li>
            <li>
                <p>收款地址</p>
                <p>1NkjfHkiqodnHjKjfjfkfkIICDINN46Jjf<img @click="copyHandle($event, 'currentAccount.receiptAddress')" src="../../../../assets/images/copy.png"></p>
            </li>
            <li>
                <p>区块</p>
                <p>325254</p>
            </li>
            <li>
                <p>交易哈希</p>
                <p>1NkjfHkiqodnHjKjfjfkknknkljbkbbjhbhbjbhbhbufkIIfgxggfgfCDINN46Jjf<img @click="copyHandle($event, 'currentAccount.hash')" src="../../../../assets/images/copy.png"></p>
            </li>
        </ul>
    </div>
</template>

<script>
import AssetBack from '@/components/AssetBack.vue'
import {clip} from '@/libs/clip.js'
export default {
    components:{AssetBack},
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
        console.log(this.$route.params)
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
