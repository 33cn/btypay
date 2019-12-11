<template>
  <div class="node_container">
    <home-header></home-header>
    <section class="header">
      <router-link :to="{ name: 'WalletIndex'}">
        <img src="../../../assets/images/back.png" alt />
      </router-link>
      <p>节点设置{{isEditing}}</p>
      <p></p>
    </section>
    <ul>
      <li>
        <p>主链节点设置</p>
        <div class="main">
          <section class="up">
            <!-- <p class="name">敢么（GMT）</p> -->
            <div v-for="(item,i) in wallet.mainNodeList" :key="i" @click="setNode(item,'main')" 
              @mouseenter="moveHandle(i,'main',item)" @mouseleave="mainMouseEnterIndex=null;isEnterCurrent=false">
              <p class="address">{{item.url}}</p>
              <img
                v-if="item.url==wallet.currentMainNode.url"
                src="../../../assets/images/selected.png"
                alt
              />
              <img
                @click.stop="delNode(item,'main')"
                v-if="item.url!=wallet.currentMainNode.url&&i>0"
                src="../../../assets/images/deleteNode.png"
                style="width:17px;height:19px"
                alt
              />
              <span
                :style="mainIsConnected==3?'color:#EF394A':mainIsConnected==1?'color:#f4c36a':''"
                v-if="item.url==wallet.currentMainNode.url" :class="isEnterCurrent&&i>0&&mainMouseEnterIndex==i?'status':''"
              >{{mainIsConnected==1?'连接中':mainIsConnected==2?'连接成功':mainIsConnected==3?'连接失败':''}}</span>
              <span v-if="mainMouseEnterIndex==i&&i>0" :class="isEnterCurrent&&i>0?'edit':''"
                style="color:#60cf5b" @click.stop="editHandle(item,'main')">编辑</span>
              <p class="line"></p>
            </div>
          </section>
          <p class="add" @click="test">添加自定义节点</p>
        </div>
      </li>
      <li>
        <p>平行链节点设置</p>
        <div class="parallel">
          <section class="up">
            <div v-for="(item,i) in wallet.parallelNodeList" :key="i" @click="setNode(item,'para')" 
              @mouseenter="moveHandle(i,'para',item)" @mouseleave="paraMouseEnterIndex=null;isEnterCurrent=false">
              <p class="name">{{item.name}}（{{item.coin}}）</p>
              <p class="address">{{item.url}}</p>
              <img
                v-if="item.url==wallet.currentParaNode.url"
                src="../../../assets/images/selected.png"
                alt
              />
              <img
                @click.stop="delNode(item,'para')"
                v-if="item.url!=wallet.currentParaNode.url&&i>0"
                src="../../../assets/images/deleteNode.png"
                style="width:17px;height:19px"
                alt
              />
              <span
                :style="parallelIsConnected==3?'color:#EF394A':parallelIsConnected==1?'color:#f4c36a':''"
                v-if="item.url==wallet.currentParaNode.url" :class="isEnterCurrent&&i>0&&paraMouseEnterIndex==i?'status':''"
              >{{parallelIsConnected==1?'连接中':parallelIsConnected==2?'连接成功':parallelIsConnected==3?'连接失败':''}}</span>
              <span v-if="paraMouseEnterIndex==i&&i>0" :class="isEnterCurrent&&i>0?'edit':''"
                style="color:#60cf5b" @click.stop="editHandle(item,'para')">编辑</span>
              <p class="line"></p>
            </div>
          </section>
          <p class="add" @click="paraDialog=true;isEditing = false;form={name:'',coin:'',url:''}">添加自定义节点</p>
        </div>
      </li>
    </ul>
    <el-dialog
      :title="isEditing?'主链节点编辑':'主链节点设置'"
      :visible.sync="mainDialog"
      width="324px"
      :show-close="false"
      class="mainNode">
      <p v-if="!isEditing">请输入您要添加的主链节点地址，建议您使用默认的主链节点</p>
      <p v-else>请输入您要编辑的主链节点地址，建议您使用默认的主链节点</p>
      <input type="text" class="mainAddress" ref="mainName" v-model="mainData" @input.prevent="inputHandle($event,'main')"/>
      <p v-if="mainIsInput" class="main_error">请输入节点地址</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mainDialog = false">取消</el-button>
        <el-button type="primary" @click="mainSubmit">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="isEditing?'平行链节点编辑':'平行链节点设置'"
      :visible.sync="paraDialog"
      width="324px"
      :show-close="false"
      class="paraNode">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="平行链名称(无需输入user.p.前缀)" prop="name">
          <el-input v-model="form.name" ref="paraName" autocomplete="off" @input="inputHandle($event,'para')"></el-input>
        </el-form-item>
        <el-form-item label="代币名称" prop="coin">
          <el-input v-model="form.coin" autocomplete="off" @input="inputHandle($event,'para')"></el-input>
        </el-form-item>
        <el-form-item label="节点地址" prop="url">
          <el-input v-model="form.url" autocomplete="off" @input="inputHandle($event,'para')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="paraDialog = false">取消</el-button>
        <el-button type="primary" @click="paraSubmit('ruleForm')">确认<span v-if="paraAdding">...</span></el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HomeHeader from "@/components/HomeHeader.vue";
import AssetBack from "@/components/AssetBack.vue";
import walletAPI from "@/mixins/walletAPI.js";
import recover from "@/mixins/recover.js";
import { createNamespacedHelpers } from "vuex";
import { getChromeStorage, setChromeStorage } from "@/libs/chromeUtil";

const { mapState } = createNamespacedHelpers("Account");

export default {
  mixins: [walletAPI,recover],
  components: { HomeHeader,AssetBack },
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
  data() {
    return {
      mainDialog: false,
      paraDialog: false,
      mainData: "",
      maindatas:{},
      mainIsInput: false,
      paraAdding:false,
      mainAdding:false,
      mainNodeList: [],
      paraNodeList: [],
      currentMainNode: "",
      currentParaNode: "",
      mouseIsEnter:false,
      mainMouseEnterIndex:null,
      paraMouseEnterIndex:null,
      isEditing:false,
      isEnterCurrent:false,
      form: {
        name: "",
        coin: "",
        url: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入平行链名称", trigger: "blur" }
        ],
        coin: [{ required: true, message: "请输入代币名称", trigger: "blur" }],
        url: [{ required: true, message: "请输入节点地址", trigger: "blur" }]
      },
      ipv4:/^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
      ipv6:/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
    
      wallets:[],
      walletName:'',
      wallet:{},
    };
  },
  methods: {
    test(){
      this.mainDialog=true;
      this.isEditing = false
      this.mainIsInput=false;
      this.mainData=''
      this.getAndSet('mainDialog',true)
    },
    editHandle(val,type){
      console.log('编辑')
      this.isEditing = true
      if(type == 'main'){
        console.log(val)
        this.mainData = val.url
        this.maindatas = val
        this.mainDialog = true
      }else if(type == 'para'){
        this.form = val
        this.paraDialog = true
      }
    },
    moveHandle(i,type,val){
      if(type == 'main'){
        this.mainMouseEnterIndex = i
        if(this.wallet.currentMainNode.url == val.url ){
          this.isEnterCurrent = true
        }
      }else if(type == 'para'){
        this.paraMouseEnterIndex = i
        if(this.wallet.currentParaNode.url == val.url ){
          this.isEnterCurrent = true
        }
      }
      // this.mouseEnterIndex = i
      this.mouseIsEnter = true
    },
    inputHandle(e,node){
      // console.log(e)
      // console.log(node)
      if(node == 'main'){
        this.getAndSet('mainData',e.target.value)
      }else if(node == 'para'){
        this.getAndSet('form',this.form)
      }
    },
    // 添加、编辑平行链节点
    paraSubmit(formName) {
      console.log(this.paraAdding)
      if(this.paraAdding){
        return
      }
      let length = this.wallet.parallelNodeList.length
      let index = null
      let obj = {}
      let arr = []
      // 添加节点
      if(!this.isEditing){
        let isExit = false
        for (let i = 0; i < length; i++) {
          if (this.wallet.parallelNodeList[i].url == this.form.url) {
            isExit = true
            this.$message.error("该节点地址已存在");
            break;
          }
        }
        if(!isExit){
          index = this.wallet.parallelNodeList[length-1].index+1;
        }else{
          return
        }
      }
      this.paraAdding = true;
      // 节点编辑
      if(this.isEditing){}
      this.$refs[formName].validate(valid => {
        if (valid) {
          let paraAddr = "";
          let tradeAddr = "";
          const p1 = this.convertExecToAddr(
            "paracross",
            this.form.url
          );
          const p2 = this.convertExecToAddr(
            "user.p." + this.form.name + ".trade",
            this.form.url
          );
          Promise.all([p1, p2]).then(([paraAddr, tradeAddr]) => {
            paraAddr = paraAddr;
            tradeAddr = tradeAddr;
            if(this.isEditing){
              obj = {
                ...this.form,
                paraAddr,
                tradeAddr
              };
              for(let i=0;i<length;i++){
                if(this.wallet.parallelNodeList[i].index == obj.index){
                  this.wallet.parallelNodeList[i] = obj
                  break
                }
              }
            }else{
              obj = {
                ...this.form,
                txHeight: -1,
                txIndex: 0,
                index,
                paraAddr,
                tradeAddr
              };
              this.wallet.parallelNodeList.push(obj);
            }
            for(let i = 0; i < this.wallets.length; i++){
              if(this.wallets[i].name == this.walletName){
                this.wallets[i].parallelNodeList = this.wallet.parallelNodeList
              }
              arr.push(JSON.stringify(this.wallets[i]))
            }
            setChromeStorage("AccountList", arr ).then(res=>{
              if (res == "success") {
                if(this.isEditing){
                  this.$message.success("平行链节点更新成功");
                  // this.setNode(obj,'para')
                }else{
                  this.$message.success("平行链节点添加成功");
                }
                this.getAndSet('form',{name:'',coin:'',url:''})
                this.getCurrentWallet()//更新视图
              }
             this.paraAdding = false;
            }).catch(err=>{
              this.paraAdding = false;
              console.log(err)
            })
            this.paraDialog = false;
            this.paraAdding = false;
          }).catch(err => {
            this.paraAdding = false;
            this.$message.error("您输入的节点地址有误。");
          });
        } else {
          this.paraAdding = false;
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 添加、编辑主链节点
    mainSubmit() {
      if(this.mainAdding){
        return
      }
      if (this.mainData == "" && this.mainDialog) {
        this.mainIsInput = true;
        return;
      }
      let length = this.wallet.mainNodeList.length
      let index = null
      let obj = {}
      let arr = []
      // 添加节点
      if(!this.isEditing){
        let isExit = false
        for (let i = 0; i < length; i++) {
          if (this.wallet.mainNodeList[i].url == this.mainData) {
            isExit = true
            this.$message.error("该节点地址已存在");
            break;
          }
        }
        if(!isExit){
          index = this.wallet.mainNodeList[length-1].index+1;
          obj = {
            url: this.mainData,
            txHeight: -1,
            txIndex: 0,
            name: "BTY",
            index
          };
          this.wallet.mainNodeList.push(obj);
        }else{
          return
        }
      }
      this.mainAdding = true
      // 节点编辑
      if(this.isEditing){
        obj = {
          ...this.maindatas,
          url: this.mainData,
        };
        for(let i=0;i<length;i++){
          if(this.wallet.mainNodeList[i].index == obj.index){
            this.wallet.mainNodeList[i] = obj
            break
          }
        }  
      }
      for(let i = 0; i < this.wallets.length; i++){
        if(this.wallets[i].name == this.walletName){
          this.wallets[i].mainNodeList = this.wallet.mainNodeList
        }
        arr.push(JSON.stringify(this.wallets[i]))
      }
      setChromeStorage("AccountList", arr ).then(res=>{
        if (res == "success") {
          console.log('this.isEditing')
          console.log(this.isEditing)
          if(!this.isEditing){
            this.$message.success("主链节点添加成功");
          }else{
            this.$message.success("主链节点更新成功");
            this.setNode(obj,'main')
          }
          this.getAndSet('mainData','')
          this.getCurrentWallet()//更新视图
        }
        this.mainAdding = false
      }).catch(err=>{
        this.mainAdding = false
        console.log(err)
      })
      this.mainDialog = false;
      this.mainData = "";
    },
    setNode(val, target) {
      let arr = []
      console.log('设置节点')
      console.log(val)
      this.isEnterCurrent = true
      if (target == "main") {
        // this.$store.commit("Account/UPDATE_CURRENT_MAIN", val);
        this.$store.commit("Account/UPDATE_MAIN_CONNECT", 1);
        // this.wallet.currentMainNode = val
      } else if (target == "para") {
        // this.$store.commit("Account/UPDATE_CURRENT_PARALLEL", val);
        this.$store.commit("Account/UPDATE_PARALLEL_CONNECT", 1);
        // this.wallet.currentParaNode = val
      }
      for(let i = 0; i < this.wallets.length; i++){
        if(this.wallets[i].name == this.walletName){
          if (target == "main"){
            this.wallets[i].currentMainNode = val
            this.$store.commit('Account/UPDATE_CURRENT_MAIN', val)
          }else if (target == "para") {
            this.wallets[i].currentParaNode = val
            this.$store.commit('Account/UPDATE_CURRENT_PARALLEL', val)
          }
        }
        arr.push(JSON.stringify(this.wallets[i]))
      }
      setChromeStorage("AccountList", arr ).then(res=>{
        if (res == "success") {
          this.$message.success("默认节点设置成功");
          this.getCurrentWallet()//更新视图
        }
      })
    },
    delNode(val,target){
      let list = []
      let arr = []
      console.log(val)
      console.log(target)
      if (target == "main"){
        for(let i = 0; i < this.wallet.mainNodeList.length; i++){
          if(val.url == this.wallet.mainNodeList[i].url){
            this.wallet.mainNodeList.splice(i,1);
            break
          }
        }
        list = this.wallet.mainNodeList
      }else if (target == "para"){
        for(let i = 0; i < this.wallet.parallelNodeList.length; i++){
          if(val.url == this.wallet.parallelNodeList[i].url){
            this.wallet.parallelNodeList.splice(i,1);
            break
          }
        }
        list = this.wallet.parallelNodeList
      }
      for(let i = 0; i < this.wallets.length; i++){
        if(this.wallets[i].name == this.walletName){
          if (target == "main"){
            this.wallets[i].mainNodeList = list
          }else if (target == "para") {
            this.wallets[i].parallelNodeList = list
          }
        }
        arr.push(JSON.stringify(this.wallets[i]))
      }
      setChromeStorage("AccountList", arr ).then(res=>{
        if (res == "success") {
          if (target == "main"){
            this.$message.success("主链节点删除成功");
          }else if (target == "para") {
            this.$message.success("平行链节点删除成功");
          }
          this.getCurrentWallet()//更新视图
        }
      })
    },
    getCurrentWallet(){
      this.getCurrentWalletName().then(name=>{
        this.walletName = name
        this.getAccountList().then(res=>{
          this.wallets = res
          for(let i = 0; i < res.length; i++){
            if(res[i].name == this.walletName){
              this.wallet = res[i]
              this.refreshMainAsset();
              this.refreshParallelAsset();
              break
            }
          }

        })
      }).catch(error=>{
        console.log('发生错误')
        this.$message.error('当前钱包名为空')
      })
    }
  },
  mounted() {
    this.getCurrentWallet()
    // this.refreshMainAsset();
    // this.refreshParallelAsset();
  },
  watch: {
    paraDialog(val) {
      this.getAndSet('paraDialog',val)
      if (!val) {
        // this.isEditing = false
        this.$refs["ruleForm"].resetFields();
        // this.getParaNode();
      } else {
        setTimeout(() => {
          this.$refs["paraName"] && this.$refs["paraName"].focus();
        }, 50);
      }
    },
    mainDialog(val) {
      this.getAndSet('mainDialog',val)
      if (val) {
        setTimeout(() => {
          this.$refs["mainName"] && this.$refs["mainName"].focus();
        }, 50);
      }else{
        // this.isEditing = false
      }
    }
  },
};
</script>

<style lang='scss'>
.node_container {
  > section.header {
    margin: 9px 55px 43px 41px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 22px;
    }
    p {
      color: #f5b947;
      font-family: MicrosoftYaHei-Bold;
      font-weight: bold;
      &:nth-of-type(1) {
        font-size: 18px;
      }
      &:nth-of-type(2) {
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
  ul {
    height: calc(100vh - 101px - 78px - 10px);
    overflow-y: scroll;
    margin: 0 26px 0 31px;
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
      background: transparent;
    }
    li {
      margin-bottom: 36px;
      > p {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        margin-bottom: 11px;
      }
      > div {
        background: rgba(251, 251, 251, 1);
        border-radius: 10px;
        padding: 19px 51px 18px 24px;
        section.up {
          div {
            position: relative;
            cursor: pointer;
            p.address {
              width: 195px;
              font-size: 14px;
              font-family: MicrosoftYaHei;
              font-weight: 400;
              color: rgba(22, 42, 84, 1);
              overflow: hidden;
              text-overflow: ellipsis;
            }
            img {
              width: 18px;
              position: absolute;
              right: -37px;
              bottom: 10px;
            }
            span {
              font-size: 12px;
              font-family: MicrosoftYaHei;
              position: absolute;
              left: 204px;
              // right: calc(-37px - 18px - 35px);
              bottom: 12px;
              color: #1cc0db;
              // color: #EF394A;
              transition: all 0.2s linear;
            }
            span.edit{
              left: 180px;
            }
            span.status{
              left: 220px;
            }
            p.name {
              font-size: 12px;
              color: rgba(22, 42, 84, 1);
              margin-bottom: 11px;
            }
          }
        }
        p.line {
          height: 1px;
          border: 0.1px solid rgba(230, 230, 230, 1);
          margin: 10px 0 17px;
        }
        p.add {
          font-size: 12px;
          font-family: MicrosoftYaHei;
          font-weight: 400;
          color: rgba(28, 192, 198, 1);
          &:hover {
            cursor: pointer;
          }
        }
        &.main {
        }
        &.parallel {
          padding-bottom: 18px;
          p.line {
            margin-top: 5px;
          }
          .up {
            img {
              bottom: 16px;
            }
            span {
              bottom: 18px;
            }
          }
        }
      }
    }
  }
  .el-dialog__wrapper {
    .el-dialog {
      // background:rgba(251,251,251,1);
      // box-shadow:0px 7px 17px 4px rgba(7,50,98,0.23);
      // border-radius:10px;
    }
    &.mainNode {
      .el-dialog {
        // background-image: url('../../../assets/images/addMainBg.png');
        p.main_error {
          font-size: 12px;
          margin-top: 4px;
          color: #f56c6c;
          position: absolute;
        }
      }
    }
    &.paraNode{
      .el-dialog{
        padding: 35px 40px 32px 40px!important;
        div.el-dialog__body{
          label{
            text-align: left;
            padding: 0px!important;
          }
        }
      }
    }
  }
}
div.el-form-item__error {
  top: calc(100% - 11px);
}
</style>
