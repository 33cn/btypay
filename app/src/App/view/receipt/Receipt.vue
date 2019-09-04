<template>
    <div class="receipt_container">
        <asset-back :title='coin=="bty"?"BTY收款":parallelAsset.name+"收款"'></asset-back>
        <section class="content">
            <canvas id="qrcode"></canvas>
            <div>
                <p class="copy" >{{currentAccount.address}}</p>
                <p @click="copyHandle($event, currentAccount.address)">复制</p>
                <!-- <img @click="copyHandle($event, currentAccount.address)" src="../../../assets/images/copy.png" alt=""> -->
            </div>
            <p>注意：该地址仅支持{{coin=='bty'?'BTY':parallelAsset.name}}收款，请勿向该地址充值其他币种。</p>
        </section>
    </div>
</template>

<script>
import AssetBack from '@/components/AssetBack.vue'
import QRious from 'qrious'
import {clip} from '@/libs/clip.js'
import {createNamespacedHelpers} from 'vuex'
const {mapState} = createNamespacedHelpers('Account')
export default {
    components:{AssetBack},
    computed:{
        ...mapState(['accountMap', 'currentAccount','parallelAsset']),
    },
    data(){
        return{
            coin:""
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
    mounted(){
        this.coin = this.$route.query.coin;
        let value = this.currentAccount?this.currentAccount.address:'出错了';
        new QRious({
            element: document.querySelector('#qrcode'),
            // background: '#000',
            // foreground: '#fff',
            level: 'H',
            size: 154,
            value
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
            margin: 20px 0 17px;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            p{
                // width: 160px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                &:nth-of-type(1){
                    color:rgba(22,42,84,1);
                    font-size:14px;
                    margin-bottom: 18px;
                }
                &:nth-of-type(2){
                    width: 56px;
                    text-align: center;
                    border:1px solid rgba(33,123,244,1);
                    border-radius:10px;
                    color: #217BF4;
                    font-size: 12px;
                    line-height: 22px;
                    cursor: pointer;
                }
                // overflow: hidden;
                // text-overflow: ellipsis;
            }
            img{
                width: 22px;
                // position: absolute;
                // right: -30px;
                // bottom: 0px;
            }
        }
        >p{
            font-size:16px;
            font-family:MicrosoftYaHei;
            font-weight:normal;
            color:rgba(22,42,84,1);
            line-height:22px;
            opacity:0.67;
            margin: 0 65px 0;
        }
    }
}
</style>
