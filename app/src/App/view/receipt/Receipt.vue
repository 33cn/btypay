<template>
    <div class="receipt_container">
        <asset-back title='BTY收款'></asset-back>
        <section class="content">
            <canvas id="qrcode"></canvas>
            <p class="copy" data-clipboard-action="copy"  data-clipboard-target=".copy">dskjsdkghdshdskfghdkf</p>
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
        clipboard.on('success', function(e) {
            alert('复制成功')
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
            size: 100,
            value: 'http://www.jq22.com/'
        })
    }
}
</script>

<style lang='scss'>
.receipt_container{
    >section.content{
        
    }
}
</style>
