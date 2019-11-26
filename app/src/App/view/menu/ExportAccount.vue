<template>
    <div class="exportAccount_container">
        <home-header></home-header>
        <asset-back title="导出账户" backPath="/WalletIndex"></asset-back>
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
import AssetBack from "@/components/AssetBack.vue";
export default {
    components: { HomeHeader,AssetBack },
    data(){
        return{
            mnemonic:'',
            mnemonicArr:[],
            // hexPrivateKey:'c2b31057b8692a56c7dd18199df71c1d21b781c0b6858c52997c9dbf778e8550'
        }
    },
    computed:{
        hexPrivateKey(){
            return this.$store.state.Account.currentAccount.hexPrivateKey;
        },
        password(){
            return this.$store.state.Account.password;
        }
    },
    methods:{
        getSeed(){
            getChromeStorage("ciphertext").then(result => {
                console.log("result");
                console.log(result);
                console.log(this.password)
                this.mnemonic = decrypt(result.ciphertext, this.password);
                console.log(decrypt(result.ciphertext, 'fanrui12'))
                console.log(this.mnemonic)
                let arr = []
                for(let i = 0;i<15;i++){
                    arr[i] = this.mnemonic.split(' ')[i]
                }
                for(let i = 0;i<4;i++){
                    if(!arr[i*4+3]){
                        arr[i*4+3] = ''
                    }
                    this.mnemonicArr.push([arr[i*4],arr[i*4+1],arr[i*4+2],arr[i*4+3]])
                }
                console.log(this.mnemonicArr)
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
        this.getSeed()
        // let arr = []
        // for(let i = 0;i<15;i++){
        //     arr[i] = this.mnemonic.split(' ')[i]
        // }
        // for(let i = 0;i<4;i++){
        //     if(!arr[i*4+3]){
        //         arr[i*4+3] = ''
        //     }
        //     this.mnemonicArr.push([arr[i*4],arr[i*4+1],arr[i*4+2],arr[i*4+3]])
        // }
        // console.log(this.mnemonicArr)
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