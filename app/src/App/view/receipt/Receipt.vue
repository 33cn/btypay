<template>
    <div class="receipt_container">
        <asset-back title='BTY收款'></asset-back>
        <section class="content">
            <canvas id="qrcode"></canvas>
            <div>
                <p class="copy" >dskjsdkghdshdskfghdkf</p>
                <img class="copy" data-clipboard-action="copy"  data-clipboard-target=".copy" src="../../../assets/images/copy.png" alt="">
            </div>
            <p>注意：该地址仅支持BTY收款，请勿向该地址充值其他币种。</p>
        </section>
    </div>
</template>

<script>
import AssetBack from '@/components/AssetBack.vue'
import QRious from 'qrious'
import Clipboard from 'clipboard'
export default {
    components:{AssetBack},
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
            size: 222,
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
        margin-top: 73px;
        display: flex;
        flex-direction: column;
        align-items: center;
        >div{
            margin: 31px 0;
            position: relative;
            p{
                font-size:20px;
                font-family:ArialMT;
                font-weight:400;
                color:rgba(22,42,84,1);
            }
            img{
                width: 25px;
                position: absolute;
                right: -45px;
                top: 4px;
            }
        }
        >p{
            font-size:20px;
            font-family:Adobe Heiti Std R;
            font-weight:normal;
            color:rgba(22,42,84,1);
            line-height:34px;
            opacity:0.67;
            margin: 0 43px 0 60px;
        }
    }
}
</style>
