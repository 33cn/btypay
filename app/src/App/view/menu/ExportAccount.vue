<template>
    <div class="exportAccount_container">
        <home-header></home-header>
        <asset-back title="导出账户" backPath="/account"></asset-back>
        <section>
            <div>
                <p>助记词</p>
                <div>
                    <ul>
                        <li v-for="(items,i) in mnemonicArr" :key="i">
                            <p v-for="item in items" :key="item">{{item}}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <p>私钥</p>
                <div>
                    <p>{{hexPrivateKey}}</p>
                    <img @click="copyHandle($event, hexPrivateKey)" src="../../../assets/images/copy.png" alt="">
                </div>
            </div>
        </section>
    </div>
</template>
<script>
import { getChromeStorage,setChromeStorage } from "@/libs/chromeUtil.js";
import { decrypt } from "@/libs/crypto.js";
import {clip} from '@/libs/clip.js'
import HomeHeader from "@/components/HomeHeader.vue";
import walletAPI from "@/mixins/walletAPI.js";
import AssetBack from "@/components/AssetBack.vue";
import recover from "@/mixins/recover.js";
export default {
    components: { HomeHeader,AssetBack },
    mixins:[walletAPI,recover],
    data(){
        return{
            mnemonic:'',
            mnemonicArr:[],
            walletName:'',
            hexPrivateKey:''
        }
    },
    computed:{
        // hexPrivateKey(){
        //     return this.$store.state.Account.currentAccount.hexPrivateKey;
        // },
        password(){
            return this.$store.state.Account.password;
        }
    },
    methods:{
        getSeed(){
            this.getAccountList().then(res=>{
                let obj = {}
                let le = res.length
                console.log('====AccountList====')
                console.log(res)
                for(let i = 0; i < le; i++){
                    console.log(i)
                    console.log(res[i])
                    if(res[i].name == this.walletName){
                        obj = res[i]
                        break
                    }
                }
                this.hexPrivateKey = obj.hexPrivateKey
                this.mnemonic = decrypt(obj.ciphertext, obj.password);
                console.log(this.mnemonic)
                let arr = []
                let mn = this.mnemonic.split(' ')
                for(let i = 0;i<15;i++){
                    arr[i] = mn[i]
                }
                for(let i = 0;i<4;i++){
                    if(!arr[i*4+3]){
                        arr[i*4+3] = ''
                    }
                    this.mnemonicArr.push([arr[i*4],arr[i*4+1],arr[i*4+2],arr[i*4+3]])
                }
            })
        },
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
        setChromeStorage('extensionStatus','').then(res=>{})
        this.walletName = this.$route.query.name;
        console.log(this.walletName)
        this.getSeed()
    }
}
</script>
<style lang="scss">
div.exportAccount_container{
    >div.assetBack_container{
        margin-top: 0px;
        padding-top: 0px;
        p{
            &:nth-of-type(2){
                top: 0px;
                color: #F5B947;
            }
        }
    }
    >section{
        margin: 33px 27px 0 31px;
        >div{
            p{
                margin: 0 0 14px 5px;
                font-size: 14px;
                color: #fff;
                font-family:Microsoft YaHei;
            }
            >div{
                background:rgba(255,255,255,1);
                border-radius:10px;
                padding: 32px 0px 4px;
                ul{
                    li{
                        display: flex;
                        margin-bottom: 26px;
                        >p{
                            width: 25%;
                            text-align: center;
                            font-size:12px;
                            font-family:Microsoft YaHei;
                            color:rgba(22,42,84,1);
                            margin: 0px;
                        }
                    }
                }
            }
            &:nth-of-type(2){
                margin-top: 29px;
                div{
                    padding: 19px 15px 17px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    p{
                        width:273px;
                        font-size:12px;
                        font-family:Microsoft YaHei;
                        color:rgba(22,42,84,1);
                        line-height:20px;
                        word-wrap:break-word;
                        margin: 0px;
                    }
                    img{
                        width: 21px;
                        height: 21px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>