<template>
    <div class="account_container">
        <home-header></home-header>
        <asset-back title="我的钱包" backPath="/WalletIndex"></asset-back>
        <p @click="$router.push('/ImportOrCreate')">新增</p>
        <ul>
            <li v-for="(item,i) in lists" :key="item.address" :class="mouseEnterIndex==i?'mouseEnter':''" 
                @mouseover="mouseEnterIndex=i"
                @click="mouseEnterIndex=i;editOrDel='pass';wallet=item;dialogIsShow=true">
                <div class="upper">
                    <p>
                        <span>{{item.name}}</span>
                        <img @click.stop="wallet=item;dialogIsShow=true;editOrDel='edit'" src="../../../assets/images/edit.png" alt="">
                    </p>
                    <img v-if="mouseEnterIndex==i" src="../../../assets/images/selected.png" alt="">
                </div>
                <div class="middle">
                    <p>总资产：<span>{{item.assets}} {{$store.state.Account.currency}}</span></p>
                    <p>
                        <span>{{item.address | addressFilter}}</span>
                        <img @click.stop="copyHandle($event, item.address)" src="../../../assets/images/copy.png" alt="">
                    </p>
                </div>
                <div class="down">
                    <p @click.stop="dialogIsShow=true;editOrDel='del';wallet=item">
                        <img src="../../../assets/images/delAccount.png" alt="">
                        <span>删除账户</span>
                    </p>
                    <p @click.stop="exportHandle(item.name)">
                        <img src="../../../assets/images/exportAccount.png" alt="">
                        <span>导出账户</span>
                    </p>
                </div>
            </li>
        </ul>
        <el-dialog
            :title="title"
            :visible.sync="dialogIsShow"
            width="324px"
            :show-close="false"
            :class="editOrDel=='del'?'mainNode delAccount':'mainNode editAccount'">
            <div v-if="editOrDel=='del'">
                <p>您确定要删除账户吗？</p>
            </div>
            <div v-else>
                <p v-if="editOrDel=='edit'">名称</p><p v-if="editOrDel=='pass'">密码</p>
                <input type="text" v-model="walletName">
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogIsShow = false">取消</el-button>
              <el-button type="primary" @click="submitHandle">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import HomeHeader from "@/components/HomeHeader.vue";
import AssetBack from "@/components/AssetBack.vue";
import { getChromeStorage,setChromeStorage } from "@/libs/chromeUtil.js";
import { clip } from "@/libs/clip.js";
import { decrypt,encrypt } from "@/libs/crypto.js";
import walletAPI from "@/mixins/walletAPI.js";
import importOrExchange from "@/mixins/importOrExchange.js";
import recover from "@/mixins/recover.js";

export default {
    components: { HomeHeader,AssetBack,recover },
    mixins:[walletAPI,importOrExchange],
    data(){
        return{
            lists:[],
            walletName:'',
            mouseIsEnter:true,
            mouseEnterIndex:null,
            dialogIsShow:false,
            editOrDel:'edit',
            wallet:{},
            // accountIndex:null
        }
    },
    methods:{
        editHandle(){
            if(this.walletName){
                let arr = []
                console.log(this.mouseEnterIndex)
                console.log(this.lists[this.mouseEnterIndex])
                this.lists[this.mouseEnterIndex].name = this.walletName
                for(let i = 0; i < this.lists.length; i++){
                    delete this.lists[i].assets
                    arr.push(JSON.stringify(this.lists[i]))
                }
                setChromeStorage("AccountList", arr ).then(res=>{
                    console.log(res)
                    // 如果更改的是当前钱包，改store,window
                    let obj = JSON.parse(JSON.stringify(this.$store.state.Account.currentAccount))
                    obj.name = this.walletName
                    this.$store.commit('Account/UPDATE_CURRENTACCOUNT',obj)
                    this.getBackgroundPage().then(win=>{
                        win.currentAccount = obj
                        this.dialogIsShow = false
                    })
                })
            }else{
                this.$message.warning("请输入钱包名称");
                return
            }
        },
        delHandle(){
            if(this.lists[this.mouseEnterIndex] == this.$store.state.Account.currentAccount.name){
                this.$message.error('不能删除当前钱包，请切换后在操作。')
                return
            }
            this.lists.splice(this.mouseEnterIndex,1)
            let arr = []
            for(let i = 0; i < this.lists.length; i++){
                delete this.lists[i].assets
                arr.push(JSON.stringify(this.lists[i]))
            }
            setChromeStorage("AccountList", arr ).then(res=>{
                console.log(res)
                this.$message.success('删除成功。')
                this.dialogIsShow = false
                this.getAccountLists()
            })
        },
        passHandle(){
            console.log(this.wallet.password)
            console.log(this.walletName)
            if(this.wallet.password == this.walletName){
                // 切换钱包<=>相当于导入钱包,区别在于是否需要输入助记词
                this.mnemonic = decrypt(this.wallet.ciphertext, this.walletName);
                this.saveSeed(this.mnemonic, this.walletName).then(res=>{
                    if(res == 'success'){
                        this.dialogIsShow = false
                        this.$message.success('已切换到'+this.wallet.name)
                    }
                }).catch(error=>{
                    console.log(error)
                })
            }else{
                this.$message.warning("输入的密码有误。");
            }
        },
        exportHandle(val){
            // this.$router.push({name:'exportAccount'})
            this.$router.push({ path: "/exportAccount?name="+val });
        },
        submitHandle(){
            if(this.editOrDel == 'edit'){
                this.editHandle()
            }else if(this.editOrDel == 'del'){
                this.delHandle()
            }else if(this.editOrDel == 'pass'){
                this.passHandle()
            }
        },
        copyHandle(event, text) {
            clip({
                event,
                text,
                response: (err, msg) => {
                    if (err) {
                        this.$message.error(msg);
                        return;
                    }
                    this.$message.success(msg);
                }
            });
        },
        getAccountLists(){
            this.getAccountList().then(res=>{
                this.lists = []
                console.log('====AccountList====')
                console.log(res)
                for(let i = 0; i < res.length; i++){
                    // let obj = JSON.parse(res[i])
                    if(res[i].name == this.$store.state.Account.currentAccount.name){
                        this.mouseEnterIndex = i
                    }
                    res[i].assets = this.getMainBalance(res[i].address)
                    this.lists.push(res[i])
                }
            })
        },
        getMainBalance(addr){
            this.getAddrBalance(addr, 'coins', this.currentMain.url).then(res => {
                if(res[0].balance){
                    res[0].balance / 1e8
                }else{
                    return 0
                }
            }).catch(err => {
              console.log(err)
            })
        },
    },
    computed:{
        title(){
            return this.editOrDel=='edit'?'更改钱包名称':this.editOrDel=='del'?'删除钱包':this.editOrDel=='pass'?'请输入'+this.wallet.name+'密码':''
        },
        currentMain(){
            return this.$store.state.Account.currentMain;
        },
        currentAccount(){
            this.$store.state.Account.currentAccount
        }
    },
    mounted(){
        this.getAccountLists()
        console.log(this.currentMain)
        console.log('this.currentMain')
    },
    watch:{
        dialogIsShow(val){
            if(!val){
                this.walletName = ''
                this.password = ''
            }
        }
    },
    filters:{
        addressFilter(val){
            return val.substr(0,13) + '…' + val.substr(-13,13)
        }
    }
}
</script>

<style lang='scss'>
.account_container{
    >div.assetBack_container{
        padding-top: 20px;
        p:nth-of-type(2){
            top: 20.5px;
            color: #F5B947
        }
    }
    >P{
        font-size:14px;
        font-family:Microsoft YaHei;
        font-weight:bold;
        color:rgba(245,185,71,1);
        position: absolute;
        right: 63px;
        top: 126px;
        cursor: pointer;
    }
    >ul{
        width: 366px;
        height: calc(600px - 100px - 42px - 29px - 10px);
        overflow: auto;
        margin: 29px auto 0px;
        padding: 0 17px;
        li{
            width: 332px;
            background:rgba(143,168,224,1);
            border-radius:10px;
            margin-bottom: 22px;
            padding: 17px 19px 18px 19px;
            cursor: pointer;
            div{
                display: flex; 
                font-family:Microsoft YaHei;
                &.upper{
                    align-items: center;
                    justify-content: space-between;
                    p{
                        span{
                            font-size:16px;
                            color:rgba(22,42,84,1);
                            margin-right: 11px;
                        }
                        img{
                            width: 17px;
                            height: 15px;
                            cursor: pointer;
                        }
                    }
                    >img{
                        width: 18px;
                        height: 18px;
                    }
                }
                &.middle{
                    display: block;
                    margin: 19px 0 22px;
                    padding: 0 14px 0 22px;
                    p{
                        width: 100%;
                        &:nth-of-type(1){
                            font-size:14px;
                            color:rgba(22,42,84,0.67);
                            span{
                                color:rgba(22,42,84,1);
                            }
                        }
                        &:nth-of-type(2){
                            font-size:12px;
                            color:rgba(22,42,84,1);
                            display: flex;
                            align-items: center;
                            margin-top: 15px;
                            img{
                                width: 12px;
                                height: 12px;
                                margin-left: 13px;
                                cursor: pointer;
                            }
                        }
                    }
                }
                &.down{
                    padding: 0 11px 0 24px;
                    justify-content: space-between;
                    align-items: center;
                    p{
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        span{
                            font-size:12px;
                            color:rgba(22,42,84,0.6);
                        }
                        img{
                            width: 24px;
                            height: 24px;
                            margin-right: 6px;
                        }
                    }
                }
            }
            &:nth-last-of-type(1){
                margin-bottom: 0px;
            }
            &.mouseEnter{
                background:rgba(203,216,242,1);
                box-shadow:0px 5px 16px 5px rgba(68,116,218,0.66);
            }
        }
        &::-webkit-scrollbar {
            width: 0px;
            height: 0px;
            background: red;
        }
    }
}
</style>