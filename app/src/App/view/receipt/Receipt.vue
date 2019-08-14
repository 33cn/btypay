<template>
    <div class="receipt_container">
        <asset-back title='BTY收款'></asset-back>
        <section class="content">
            <canvas id="qrcode"></canvas>
            <div>
                <p class="copy" >dskjsdkghdshdskfghdkf</p>
                <img @click="copyHandle($event, 'currentAccount.hash')" src="../../../assets/images/copy.png" alt="">
            </div>
            <p>注意：该地址仅支持BTY收款，请勿向该地址充值其他币种。</p>
        </section>
    </div>
</template>

<script>
import AssetBack from '@/components/AssetBack.vue'
import QRious from 'qrious'
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
                    this.$serverErrNotify(msg)
                    return
                  }
                  this.$serverSucNotify(msg)
                }
            })
        }
    },
    mounted(){
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
        new QRious({
            element: document.querySelector('#qrcode'),
            // background: '#000',
            // foreground: '#fff',
            level: 'H',
            size: 154,
            value: 'http://www.jq22.com/'
        })
    }
}
</script>

<style lang='scss'>
.receipt_container{
    width: 100%;
    height: 100vh;
    background-image: url('../../../assets/images/lightColorBg.png');
    background-size: 100% 100%;
    >section.content{
        margin-top: 53px;
        display: flex;
        flex-direction: column;
        align-items: center;
        >div{
            margin: 20px 0 22px;
            position: relative;
            p{
                font-size:14px;
                font-family:ArialMT;
                font-weight:400;
                color:rgba(22,42,84,1);
            }
            img{
                width: 22px;
                position: absolute;
                right: -30px;
                bottom: 0px;
            }
        }
        >p{
            font-size:16px;
            font-family:Adobe Heiti Std R;
            font-weight:normal;
            color:rgba(22,42,84,1);
            line-height:22px;
            opacity:0.67;
            margin: 0 65px 0;
        }
    }
}
</style>
