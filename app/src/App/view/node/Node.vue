<template>
    <div class="node_container">
        <home-header></home-header>
        <section class="header">
            <router-link :to="{ name: 'WalletIndex'}"><img src="../../../assets/images/close.png" alt=""></router-link>
            <p>节点设置</p>
            <p></p>
        </section>
        <ul>
            <li>
                <p>主链节点设置</p>
                <div class="main">
                    <section class="up">
                        <!-- <p class="name">敢么（GMT）</p> -->
                        <div v-for="(item,i) in mainNodeList" :key="i" @click="setNode(item,'main')">
                            <p class="address">{{item.url}}</p>
                            <img v-if="item.url==currentMainNode.url" src="../../../assets/images/selected.png" alt="">
                            <span :style="mainIsConnected==3?'color:#EF394A':mainIsConnected==1?'color:#f4c36a':''" v-if="item.url==currentMainNode.url">
                                {{mainIsConnected==1?'连接中':mainIsConnected==2?'连接成功':mainIsConnected==3?'连接失败':''}}
                            </span>
                            <p class="line"></p>
                        </div>
                    </section>
                    <p class="add" @click="mainDialog=true;mainIsInput=false;mainData=''">添加自定义节点</p>
                </div>
            </li>
            <li>
                <p>平行链节点设置</p>
                <div class="parallel">
                    <section class="up">
                        <div v-for="(item,i) in paraNodeList" :key="i" @click="setNode(item,'para')">
                            <p class="name">{{item.name}}（{{item.coin}}）</p>
                            <p class="address">{{item.url}}</p>
                            <img v-if="item.url==currentParaNode.url" src="../../../assets/images/selected.png" alt="">
                            <span :style="parallelIsConnected==3?'color:#EF394A':parallelIsConnected==1?'color:#f4c36a':''" v-if="item.url==currentParaNode.url">
                                {{parallelIsConnected==1?'连接中':parallelIsConnected==2?'连接成功':parallelIsConnected==3?'连接失败':''}}
                            </span>
                            <p class="line"></p>
                        </div>
                    </section>
                    <p class="add" @click="paraDialog=true">添加自定义节点</p>
                </div>
            </li>
        </ul>
        <el-dialog title="主链节点设置" :visible.sync="mainDialog" width='324px' :show-close=false class="mainNode">
            <p>请输入您要添加的主链节点地址，建议您使用默认的主链节点</p>
            <input type="text" class="mainAddress" ref="mainName" v-model="mainData">
            <p v-if="mainIsInput" class="main_error">请输入节点地址</p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="mainDialog = false">取消</el-button>
                <el-button type="primary" @click="mainSubmit">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="平行链节点设置" :visible.sync="paraDialog" width='324px' :show-close=false class="paraNode">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="平行链名称" prop="name">
                    <el-input v-model="form.name" ref="paraName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="代币名称" prop="coin">
                    <el-input v-model="form.coin" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="节点地址" prop="url">
                    <el-input v-model="form.url" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="paraDialog = false">取消</el-button>
                <el-button type="primary" @click="paraSubmit('ruleForm')">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import HomeHeader from "@/components/HomeHeader.vue";
import walletAPI from '@/mixins/walletAPI.js'
import { createNamespacedHelpers } from "vuex";
import { getChromeStorage, setChromeStorage } from "@/libs/chromeUtil"

const { mapState } = createNamespacedHelpers("Account");

export default {
    mixins: [walletAPI],
    components: { HomeHeader },
    computed: {
        ...mapState([
          "accountMap",
          "currentAccount",
          "currentMain",
          "currentParallel",
          "mainAsset",
          "parallelAsset",
          "mainNode",
          "parallelNode",
          "mainIsConnected",
          "parallelIsConnected"
        ])
    },
    data(){
        return{
            mainDialog:false,
            paraDialog:false,
            mainData:'',
            mainIsInput:false,
            mainNodeList:[],
            paraNodeList:[],
            currentMainNode:'',
            currentParaNode:'',
            form:{
                name:'',
                coin:'',
                url:'',
                index: 0,
                txHeight: -1, 
                txIndex: 0
            },
            rules:{
                name: [{ required: true, message: "请输入平行链名称", trigger: "blur" }],
                coin: [{ required: true, message: "请输入代币名称", trigger: "blur" }],
                url: [{ required: true, message: "请输入节点地址", trigger: "blur" }],
            }
        }
    },
    methods:{
        paraSubmit(formName){
            for(let i = 0; i < this.paraNodeList.length; i++){
                if(this.paraNodeList[i].url == this.form.url){
                    this.$message.error('该节点地址已存在')
                    return
                }
            }
            this.$refs[formName].validate(valid => {
                if (valid) {
                  console.log("submit!");
                  let obj = JSON.parse(JSON.stringify(this.form))
                  let arr = this.paraNodeList.concat([obj])
                  this.$store.commit("Account/UPDATE_PARALLEL_NODE", obj);
                  setChromeStorage('parallelNodeList',arr).then(res=>{
                    if(res=='success'){
                        // this.paraNodeList = this.mainNode;
                        this.$message.success('平行链节点添加成功');
                        this.getParaNode();//更新视图
                    }
                }).catch(err=>{
                    console.log(err)
                })
                  this.paraDialog = false;
                } else {
                  console.log("error submit!!");
                  return false;
                }
            });
        },
        mainSubmit(){
            if(this.mainData == ''&&this.mainDialog){
                this.mainIsInput = true;
                return
            }
            for(let i = 0; i < this.mainNodeList.length; i++){
                if(this.mainNodeList[i].url == this.mainData){
                    this.$message.error('该节点地址已存在')
                    return
                }
            }
            let arr = this.mainNodeList.concat([{'url':this.mainData,txHeight: -1, txIndex: 0, name: "BTY",index: 0}])
            this.$store.commit("Account/UPDATE_MAIN_NODE", {'url':this.mainData,txHeight: -1, txIndex: 0, name: "BTY",index: 0});
            console.log('this.mainData')
            console.log(this.mainData)
            setChromeStorage('mainNodeList',arr).then(res=>{
              if(res=='success'){
                // this.mainNodeList = this.mainNode;
                this.$message.success('主链节点添加成功');
                this.getMainNode();//更新视图
              }
            }).catch(err=>{
                console.log(err)
            })
            this.mainDialog = false;
            this.mainData = '';
        },
        setNode(val,target){
            console.log('setNOde====================')
            console.log(val)
            if(target == 'main'){
                this.$store.commit('Account/UPDATE_CURRENT_MAIN',val)
                this.$store.commit('Account/UPDATE_MAIN_CONNECT',1)
                setChromeStorage('mainNode',val).then(res=>{
                  if(res=='success'){
                    this.$message.success('默认节点设置成功')
                    this.getMainNode();//更新视图
                    this.refreshMainAsset().then(res=>{});
                  }
                }).catch(err=>{
                    console.log(err)
                })
            }else if(target == 'para'){
                this.$store.commit('Account/UPDATE_CURRENT_PARALLEL',val)
                this.$store.commit('Account/UPDATE_PARALLEL_CONNECT',1)
                setChromeStorage('paraNode',val).then(res=>{
                  if(res=='success'){
                    this.$message.success('默认节点设置成功')
                    this.getParaNode();//更新视图
                    this.refreshParallelAsset().then(res=>{});
                  }
                }).catch(err=>{
                    console.log(err)
                })
            }
            
        },
        getMainNode(){
            getChromeStorage('mainNodeList').then(res=>{
                console.log(res)
                if(res.mainNodeList){
                    this.mainNodeList = res.mainNodeList;
                }
            })
            getChromeStorage('mainNode').then(res=>{
                console.log(res)
                if(res.mainNode){
                    this.currentMainNode = res.mainNode;
                }
            })
            
        },
        getParaNode(){
            getChromeStorage('parallelNodeList').then(res=>{
                // console.log(res)
                if(res.parallelNodeList){
                    this.paraNodeList = res.parallelNodeList;
                }
            })
            getChromeStorage('paraNode').then(res=>{
                console.log(res)
                if(res.paraNode){
                    this.currentParaNode = res.paraNode;
                }
            })
        }
    },
    mounted(){
        this.mainNodeList = this.mainNode;
        this.paraNodeList = this.parallelNode;
        this.getMainNode();
        this.getParaNode();
        // this.refreshMainAsset();
        // this.refreshParallelAsset();
    },
    watch:{
        paraDialog(val){
            if(!val){
                this.$refs['ruleForm'].resetFields();
            }else{
                setTimeout(() => {
                    this.$refs["paraName"] && this.$refs["paraName"].focus();
                }, 50);
            }
        },
        mainDialog(val){
            if(val){
                setTimeout(() => {
                    this.$refs["mainName"] && this.$refs["mainName"].focus();
                }, 50);
            }
        }
    }
}
</script>

<style lang='scss'>
.node_container{
    >section.header{
        margin: 9px 55px 43px 41px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img{
            width: 22px;
        }
        p{
            color: #F5B947;
            font-family:MicrosoftYaHei-Bold;
            font-weight:bold;
            &:nth-of-type(1){
                font-size: 18px;
            }
            &:nth-of-type(2){
                font-size: 14px;
                cursor: pointer;
            }
        }
    }
    ul{
        height: calc(100vh - 101px - 78px - 10px);
        overflow-y: scroll;
        margin: 0 26px 0 31px;
        &::-webkit-scrollbar {
            width: 0px;
            height: 0px;
            background: transparent;
        }
        li{
            margin-bottom: 36px;
            >p{
                font-size:16px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(255,255,255,1);
                margin-bottom: 11px;
            }
            >div{
                background:rgba(251,251,251,1);
                border-radius:10px;
                padding: 19px 51px 18px 24px;
                section.up{
                    div{
                        position: relative;
                        cursor: pointer;
                        p.address{
                            width: 195px;
                            font-size:14px;
                            font-family:MicrosoftYaHei;
                            font-weight:400;
                            color:rgba(22,42,84,1);
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        img{
                            width: 18px;
                            position: absolute;
                            right: -37px;
                            bottom: 10px;
                        }
                        span{
                            font-size:12px;
                            font-family:MicrosoftYaHei;
                            position: absolute;
                            left: 204px;
                            // right: calc(-37px - 18px - 35px);
                            bottom: 12px;
                            color: #1CC0DB;
                            // color: #EF394A;
                        }
                        p.name{
                            font-size: 12px;
                            color:rgba(22,42,84,1);
                            margin-bottom: 11px;
                        }
                    }
                }
                p.line{
                    height: 1px;
                    border:0.1px solid rgba(230,230,230,1);
                    margin: 10px 0 17px;
                }
                p.add{
                    font-size:12px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    color:rgba(28,192,198,1);
                    &:hover{
                      cursor: pointer;
                    }
                }
                &.main{
                    
                }
                &.parallel{
                    padding-bottom: 18px;
                    p.line{
                        margin-top: 5px;
                    }
                    .up{
                        img{
                            bottom: 16px;
                        }
                        span{
                            bottom: 18px;
                        }
                    }
                }
            }
        }
    }
    .el-dialog__wrapper{
        .el-dialog{
            // background:rgba(251,251,251,1);
            // box-shadow:0px 7px 17px 4px rgba(7,50,98,0.23);
            // border-radius:10px;
        }
        &.mainNode{
            .el-dialog{
                // background-image: url('../../../assets/images/addMainBg.png');
                p.main_error{
                    font-size: 12px;
                    margin-top: 4px;
                    color: #F56C6C;
                    position: absolute;
                }
            }
        }
    }
}
div.el-form-item__error{
    top: calc(100% - 11px);
}
</style>
