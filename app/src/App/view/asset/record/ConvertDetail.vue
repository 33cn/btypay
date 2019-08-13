<template>
    <div class="convertDetail_container">
        <asset-back title='订单详情'></asset-back>
        <section class="status">
            <img src="../../../../assets/images/success.png" alt="">
            <p>兑换成功</p>
            <p>2019/02/21 10:12:12</p>
        </section>
        <ul>
            <li>
                <p>转出</p>
                <p>100 BTY</p>
            </li>
            <li>
                <p>收到</p>
                <p>100 Game</p>
            </li>
            <li>
                <p>汇率</p>
                <p>1BTY=1GAME</p>
            </li>
            <li>
                <p>矿工费</p>
                <p>0.1BTY</p>
            </li>
            <li>
                <p>区块</p>
                <p>325254</p>
            </li>
            <li>
                <p>交易哈希</p>
                <p class="copy" data-clipboard-action="copy"  data-clipboard-target=".copy">1NkjfHkiqodnHjKjfjfkknknkljbkbbjhbhbjbhbhbufkIIfgxggfgfCDINN46Jjf<img src="../../../../assets/images/copy.png"></p>
            </li>
        </ul>
    </div>
</template>

<script>
import AssetBack from '@/components/AssetBack.vue'
import Clipboard from 'clipboard'
export default {
    components:{AssetBack},
    mounted(){
        console.log(this.$route.params);
        var clipboard = new Clipboard('.copy');
        clipboard.on('success', (e) => {
            console.log(this)
            this.$serverSucNotify('复制成功')
            // console.info('Action:', e.action);
            // console.info('Text:', e.text);
            // console.info('Trigger:', e.trigger);
            e.clearSelection();
        });
        clipboard.on('error', function(e) {
            // console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
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
        margin: 32px 0 43px;
        display: flex;
        flex-direction: column;
        align-items: center;
        img{
            width: 50.5px;
        }
        p{
            font-family:MicrosoftYaHei;
            font-weight:400;
            line-height: 1;
            &:nth-of-type(1){
                font-size:18px;
                color:rgba(22,42,84,1);
                margin: 23px 0 16px;
            }
            &:nth-of-type(2){
                font-size:15px;
                color:rgba(153,153,153,1);
            }
        }
    }
    >ul{
        margin: 0 20.5px 0 25px;
        li{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 19.5px;
            p{
                font-family:MicrosoftYaHei;
                font-weight:400;
                line-height: 1;
                color:rgba(22,42,84,1);
                &:nth-of-type(1){
                    width: 100px;
                    font-size: 18px;
                    // line-height:3;
                    opacity:0.67;
                }
                &:nth-of-type(2){
                    font-size: 16.5px;
                    word-wrap:break-word;
                    word-break: break-all;
                    width: calc(100% - 100px);
                    flex-wrap: wrap;
                    img{
                        width: 16.5px;
                        margin: 4px 0 0 16px;
                    }
                }
            }
        }
    }
}
</style>
