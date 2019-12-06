<template>
    <div class="homeHeader_container" :style="isHidden?'display: none':''">
        <div class="head" :style="isHidden?'display: none':'display:flex'">
            <p><img src="../assets/images/logo.png" alt=""></p>
            <div class="menu" v-if="!WalletIndex">
                <el-tooltip class="item" effect="dark" content="交易所" placement="bottom">
                    <router-link :to="{ name: 'dapps'}"><img src="../assets/images/zhaobi.png" alt=""></router-link>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="DAPP" placement="bottom">
                    <router-link :to="{ name: 'dapps'}"><img src="../assets/images/dappIcon.png" alt=""></router-link> 
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="锁定" placement="bottom">
                    <img @click="lockHandle" src="../assets/images/lock.png" alt="">  
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="菜单" placement="bottom">
                    <img src="../assets/images/menu.png" alt="" @click="dropdownIsShow=true">  
                </el-tooltip>
            </div>
        </div>
        <div class="mask" v-if="dropdownIsShow" @click="dropdownIsShow=false"></div>
        <ul class="dropdown" v-if="dropdownIsShow">
            <li v-for="(item,i) in menus" :key="i" @click="logoutHandle(item.path)">
                <img :src='"../assets/images/"+item.img+".png"' alt="">
                <p>{{item.name}}</p>
            </li>
        </ul>
        <!-- <p>比特元钱包</p> -->
        <!-- <input type="button" value="按钮1" @contextmenu.prevent="show1()">  -->
    </div>
</template>

<script>
import { setChromeStorage,getChromeStorage } from "@/libs/chromeUtil.js";
let isDev = process.env.NODE_ENV === 'development'
export default {
    props:['isHidden'],
    data(){
        return{
            dropdownIsShow:false,
            menus:[
                {name:'节点设置',img:'nodeSetIcon',path:'node'},
                {name:'我的钱包',img:'exportIcon',path:'account'},
                {name:'货币设置',img:'currencyIcon',path:'currencySet'},
                {name:'关于我们',img:'aboutIcon',path:'about'},
                // {name:'退出登录',img:'logoutIcon',path:'ImportOrCreate'},
            ],
            WalletIndex:false
        }
    },
    methods:{
        // 锁定
        lockHandle(){
            this.getBackgroundPage().then(win => {
                // win.myChain33WalletInstance = null
                setTimeout(() => {
                    this.$router.push({name:'login'})
                }, 100);
            })
            // this.$router.push({name:'login'})

        },
        // 登出
        logoutHandle(name){
            console.log('登出'+name)
            if(name == 'ImportOrCreate'){
                let p1 = setChromeStorage('beforePath', {})
                let p2 = setChromeStorage('ciphertext', '')
                let p3 = getChromeStorage("AccountList")
                let p4 = this.getBackgroundPage()
                Promise.all([p1, p2,p3,p4]).then(([r1,r2,r3,win])=>{
                    console.log('success')
                    console.log(r3)
                    console.log(r3.AccountList.length)
                    console.log(win.currentAccount)
                    let obj = {}
                    let list = {}
                    let index = null
                    for(let i = 0; i < r3.AccountList.length; i++){
                        let pA = JSON.parse(r3.AccountList[i])
                        console.log(pA)
                        if(pA.name == win.currentAccount.name){
                            index = i
                            obj.name = pA.name
                            obj.mainNodeList = pA.mainNodeList
                            obj.parallelNodeList = pA.parallelNodeList
                            obj.currentMainNode = pA.currentMainNode
                            obj.currentParaNode = pA.currentParaNode
                            obj.isLogout = true
                        }
                        break
                    }
                    console.log(index)
                    r3.AccountList[index] = JSON.stringify(obj)
                    console.log('=====r3[index]=====')
                    console.log(r3.AccountList[index])
                    list = r3.AccountList
                    console.log('=====list======')
                    console.log(list)
                    setChromeStorage("AccountList", list ).then(res=>{
                        win.myChain33WalletInstance = null
                        win.currentAccount = null
                        this.$store.commit('Account/UPDATE_CURRENTACCOUNT', null)
                        this.$store.commit('Account/UPDATE_ACCOUNTS', null)
                        this.dropdownIsShow = false
                        this.$router.push({name})
                    })
                }).catch(err=>{
                    console.log(err)
                })
                // .then(res=>{
                //     this.$router.push({name})
                //     this.dropdownIsShow = false
                // })
            }else{
                this.dropdownIsShow = false
                this.$router.push({name})
            }
        },
        // getBackgroundPage(){
        //     return new Promise((resolve) => {
        //         if (isDev) {
        //           resolve(window)
        //         } else {
        //           window.chrome.runtime.getBackgroundPage(win => {
        //             resolve(win)
        //           })
        //         }
        //     })
        // }
    },
    mounted(){
        this.WalletIndex = window.location.href.indexOf('WalletIndex') == -1
        // console.log(window.location.href.indexOf('WalletIndex'))
    }
}
</script>

<style lang='scss'>
.homeHeader_container{
    padding: 27px 41px 37px 34px;
    // display: none;
    >div.head{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
            p{
            &:nth-of-type(1){
                // padding:0px 13px 0px 34px;
                img{
                    width: 102px;
                    height: 35px;
                }
            }
            &:nth-of-type(2){
                font-size:18px;
                font-family:MicrosoftYaHei;
                // font-family: "Hiragino Sans GB";
                font-weight:400;
                color:rgba(255,255,255,1);
            }
        }
        >div.menu{
            // margin-top: 10px;
            a{
                width: 34px;
                height: 34px;
                display: inline-block;
                img{
                    width: 100%;
                    height: 100%;
                }
                &:nth-of-type(2){
                    margin-left: 10px;
                }
            }
            >img{
                width: 34px;
                height: 34px;
                cursor: pointer;
                &:nth-of-type(1){
                    margin: 0 10px;
                }
            }
        }
    }
    >div.mask{
        width: 400px;
        height: 600px;
        position: absolute;
        top: 0px;
        left: 0px;
    }
    >ul.dropdown{
        width:109px;
        padding: 22px 0px 20px 14px;
        background:rgba(118,150,218,1);
        box-shadow:0px 8px 45px 1px rgba(68,116,218,0.83);
        border-radius:10px;
        z-index: 1000;
        position: absolute;
        right: 21px;
        top: 78px;
        li{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 20px;
            cursor: pointer;
            img{
                width: 14px;
                height: 14px;
                margin-right: 7px;
            }
            p{
                font-size:13px;
                font-family:Microsoft YaHei;
                color:rgba(255,255,255,1);
            }
            &:nth-of-type(3){
                img{
                    width: 13px;
                    height: 12px;
                }
            }
            &:nth-of-type(4){
                img{
                    width: 12px;
                    height: 12px;
                }
            }
            &:nth-of-type(5){
                margin-bottom: 0px;
                img{
                    width: 13px;
                    height: 13px;
                }
            }
        }
        &::after{
            content:'';
            width: 0;
            height: 0;
            border-right:7px solid transparent;
            border-left: 7px solid transparent;
            border-bottom: 11px solid rgba(118,150,218,1);
            position: absolute;
            left: 64px;
            top: -11px;
            // background:rgba(118,150,218,1);
            box-shadow:0px 16px 45px 1px rgba(68,116,218,0.63);
        }
    }
}
</style>
