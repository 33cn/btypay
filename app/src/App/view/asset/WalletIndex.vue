<template>
  <div class="walletIndex_container">
    <home-header></home-header>
    <p @click="getBalance">
      <!-- <router-link :to="{ name: 'login'}">刷新</router-link> -->
      刷新
    </p>
    <section class="content">
      <!-- <p>我的资产</p> -->
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link" @click="isRotate=!isRotate">
          {{currentAccount.name}}
          <i :class="isRotate?'el-icon-arrow-down el-icon--right rotate':'el-icon-arrow-down el-icon--right'"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="walletIndex">
          <el-dropdown-item v-for="(item,i) in accountList" :key="i" 
            :command="item" :class="currentAccount.name==item?'currentAccount':''">{{item.name}}</el-dropdown-item>
          <!-- <el-dropdown-item command="b">钱包二</el-dropdown-item>
          <el-dropdown-item command="c">钱包三</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
      <ul>
        <li @click="toBty">
          <div class="left">
            <img src="../../../assets/images/btyLogo.png" alt />
            <p>BTY</p>
          </div>
          <div class="right">
            <p v-if="numIsAnimation" id="bty">0.0000</p>
            <p v-if="numIsAnimation" id="btyPrice">≈￥0.0000</p>
            <p v-if="!numIsAnimation">{{ mainAsset.amt | numFilter(4)}}</p>
            <p v-if="!numIsAnimation">≈<span v-if="currency=='USD'">$</span><span v-else>￥</span>
            {{ mainAsset.amt * mainAsset.price | numFilter(4)}}{{currency}}</p>
          </div>
        </li>
        <li @click="toGame" ref="game">
          <div class="left">
            <img src="../../../assets/images/gameLogo.png" alt />
            <p>{{ currentParallel.coin }}</p>
          </div>
          <div class="right">
            <p v-if="numIsAnimation" id="game">0.0000</p>
            <p v-if="numIsAnimation" id="gamePrice">≈￥0.0000</p>
            <p v-if="!numIsAnimation">{{ parallelAsset.amt | numFilter(4)}}</p>
            <p v-if="!numIsAnimation">≈<span v-if="currency=='USD'">$</span><span v-else>￥</span>
              {{ parallelAsset.amt * parallelAsset.price | numFilter(4)}}{{currency }}</p>
          </div>
        </li>
      </ul>
    </section>
    <el-dialog
      :title="'请输入'+this.wallet.name+'钱包密码'"
      :visible.sync="dialogIsShow"
      width="324px"
      :show-close="false"
      class="mainNode editAccount">
      <div>
          <p>密码</p>
          <input type="password" v-model="password">
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
import { createNamespacedHelpers } from "vuex";
import walletAPI from "@/mixins/walletAPI.js";
import chain33API from "@/mixins/chain33API.js";
import { eventBus } from "@/libs/eventBus";
import { setChromeStorage,getChromeStorage } from "@/libs/chromeUtil.js";
import { decrypt,encrypt } from "@/libs/crypto.js";
const { mapState } = createNamespacedHelpers("Account");
import importOrExchange from "@/mixins/importOrExchange.js";
import recover from "@/mixins/recover.js";
var httpRequest = new XMLHttpRequest();
export default {
  mixins: [walletAPI, chain33API,importOrExchange,recover],
  components: { HomeHeader },
  data() {
    return {
      delMenu: {
        left: 0,
        top: 0
      },
      menuIsShow: false,
      dialogIsShow:false,
      numIsAnimation:true,
      accountList:[],
      password:'',
      wallet:{},
      isRotate:false,
    };
  },
  computed: {
    ...mapState([
      "accountMap",
      "currentAccount",
      "currentMain",
      "currentParallel",
      "mainAsset",
      "parallelAsset"
    ]),
    currency(){
        return this.$store.state.Account.currency || 'CNY'
    }
  },
  methods: {
    handleCommand(val) {
      if(val.name == this.currentAccount.name){
        this.$message.warning('已是当前钱包')
        return
      }
      this.wallet = val
      console.log(this.wallet)
      this.dialogIsShow = true
    },
    submitHandle(){
      if(this.wallet.password == this.password){
        // 切换钱包<=>相当于导入钱包,区别在于是否需要输入助记词
        let mnemonic = decrypt(this.wallet.ciphertext, this.password);
        this.saveSeed(mnemonic, this.password).then(res=>{
            if(res == 'success'){
                this.dialogIsShow = false
                this.$message.success('已切换到'+this.wallet.name)
                this.getBalance()
            }
        }).catch(error=>{
            console.log(error)
        })
      }else{
        this.$message.warning("输入的密码有误。");
      }
    },
    toBty() {
      this.$store.commit("Records/ASSET_TYPE", "bty");
      setChromeStorage('currentPageCoin','bty').then(res=>{

      })
      // if(this.currentMain && this.currentMain.url){
      //   console.log(this.currentMain)
      //   eventBus.$emit('node-change', this.currentMain.url)
      // }
      this.$router.push({ path: "/coin?coin=bty" });
    },
    toGame() {
      this.$store.commit("Records/ASSET_TYPE", "game");
      setChromeStorage('currentPageCoin','game').then(res=>{
        
      })
      // if(this.currentParallel && this.currentParallel.url){
      //   console.log(this.currentParallel)
      //   eventBus.$emit('node-change', this.currentParallel.url)
      // }
      this.$router.push({ path: "/coin?coin=game" });
    },
    delHandle() {
      this.menuIsShow = false;
    },
    numFilter(val) {
      if (val || val == 0) {
        let f = parseFloat(val)
        let result = Math.floor(f * 10000) / 10000;
        return parseFloat(result).toFixed(4)
      }
    },
    init() {
      this.getWallet().then(wallet => {
        if (wallet&&wallet.accountMap) {
          // console.log("walletInd////
          this.$store.commit("Account/UPDATE_ACCOUNTS", wallet.accountMap);
        }
      });
      this.recoverAccount();
      this.getCurrentAccount();

      // if (this.currentAccount) {
      //   this.getBalance(this.currentAccount.address)
      // }
    },
    NumAutoPlusAnimation(ele, options = {}) {
      let time = options.time, //总时间--毫秒为单位
        finalNum = options.num , //要显示的真实数值
        regulator = options.regulator || 100, //调速器，改变regulator的数值可以调节数字改变的速度
        step = finalNum / (time / regulator) /*每30ms增加的数值--*/,
        count = 0.0, //计数器
        initial = 0,
        currency = this.currency;

      let timer = setInterval(function() {
        count = count + step;

        if (count >= finalNum) {
          clearInterval(timer);
          count = finalNum;
        }
        //t未发生改变的话就直接返回
        //避免调用text函数，提高DOM性能
        var t = parseFloat(count).toFixed(4);
        if (t == initial) return;

        initial = t;
        if(ele.indexOf('Price') > -1){
          if(currency=='CNY'){
            document.querySelector('#'+ele).innerHTML = '≈￥'+initial+currency;
          }else if(currency=='USD'){
            document.querySelector('#'+ele).innerHTML = '≈$'+initial+currency;
          }
        }else{
          document.querySelector('#'+ele).innerHTML = initial;
        }
      }, 30);
    },
    getBalance(){
      setTimeout(() => {
        this.refreshMainAsset().then(res=>{
          if(res == 'success'){
            if(this.numIsAnimation){
              this.NumAutoPlusAnimation('bty',{
                time: 1500,
                num: this.numFilter(this.mainAsset.amt),
                regulator: 50
              })
              console.log('this.mainAsset.amt*this.mainAsset.price')
              console.log(this.mainAsset.amt*this.mainAsset.price)
              this.NumAutoPlusAnimation('btyPrice',{
                time: 1500,
                num: this.numFilter(this.mainAsset.amt*this.mainAsset.price),
                regulator: 50
              })
            }
          }
        })
        this.refreshParallelAsset().then(res=>{
          if(res == 'success'){
            if(this.numIsAnimation){
              this.NumAutoPlusAnimation('game',{
                time: 1500,
                num: this.numFilter(this.parallelAsset.amt),
                regulator: 50
              })
              this.NumAutoPlusAnimation('gamePrice',{
                time: 1500,
                num: this.numFilter(this.parallelAsset.amt*this.parallelAsset.price),
                regulator: 50
              })
            }
          }
        });
      }, 200);
    },
    // 登录、创建、导入钱包后更新store==》currentAccount，node
    update_store(){
      let p1 = this.getAccountList()
      let p2 = this.getCurrentWalletName()
      Promise.all([p1, p2]).then(([wallets,name])=>{
        this.accountList = wallets
        for(let i = 0; i < wallets.length; i++){
          if(wallets[i].name == name){
            let account = {}
            account.address = wallets[i].address
            account.hexPrivateKey = wallets[i].hexPrivateKey
            account.name = wallets[i].name
            account.pasword = wallets[i].password
            account.ciphertext = wallets[i].ciphertext
            this.$store.commit('Account/UPDATE_MAIN_NODE', wallets[i].mainNodeList)
            this.$store.commit('Account/UPDATE_PARALLEL_NODE', wallets[i].parallelNodeList)
            this.$store.commit('Account/UPDATE_CURRENT_MAIN', wallets[i].currentMainNode)
            this.$store.commit('Account/UPDATE_CURRENT_PARALLEL', wallets[i].currentParaNode)
            this.$store.commit('Account/UPDATE_CURRENTACCOUNT', account)
          }
        }
      })
    },
    // 获取bty价格
    getPrice(){
      httpRequest.open('GET', 'https://m.zhaobi.xyz/api/data/Ticker?sort=cname', true)
      httpRequest.send();
      httpRequest.onreadystatechange =  ()=> {
          if (httpRequest.readyState == 4 && httpRequest.status == 200) {
              var json = httpRequest.responseText;
              let obj = JSON.parse(json).data
              console.log(obj)
              console.log(this.currency)
              console.log(this.$store.state.Account.currency)
              if(this.currency == 'USD'){
                let val = obj.USDT
                for(let i = 0; i < val.length; i++){
                  if(val[i].symbol == "BTYUSDT"){
                    this.$store.commit('Account/UPDATE_MAIN_ASSET', {price:val[i].last})
                    this.getBalance(val[i].last)
                    console.log(val[i].last)
                    break
                  }
                }
              }else{
                let val = obj.CCNY
                console.log(val)
                for(let i = 0; i < val.length; i++){
                  if(val[i].symbol == "BTYCCNY"){
                    this.$store.commit('Account/UPDATE_MAIN_ASSET', {price:val[i].last})
                    this.getBalance(val[i].last)
                    console.log(val[i].last)
                    break
                  }
                }
              }
          }
      };
    }
  },
  watch:{
    dialogIsShow(val){
      if(!val){
        this.password = ''
      }
    }
  },
  mounted() {
    setChromeStorage('extensionStatus','').then(res=>{})
    this.getPrice()
    // this.getBalance()
    this.$store.commit("Records/LOADING_RECORDS", []); //清空记录
    // setChromeStorage('element',{}).then(res=>{})
    // setChromeStorage('beforePath',{}).then(res=>{})
    this.update_store()
  },
  beforeRouteEnter(to, from, next){
    next(vm=>{
        // console.log(from)
        if(from.name == 'login' || from.name == 'ImportWallet' || from.name == 'WordsConfirm'){
          vm.numIsAnimation = true;
        }else{
          vm.numIsAnimation = false
        }
    })
  }
};
</script>

<style lang='scss'>
.walletIndex_container {
  width: 100%;
  height: 100vh;
  background-image: url("../../../assets/images/lightIndexBg.png");
  background-size: 100% 100%;
  > p {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold;
    font-weight: bold;
    position: absolute;
    right: 45px;
    top: 128px;
    color: rgba(245, 185, 71, 1);
    cursor: pointer;
    a {
      color: rgba(245, 185, 71, 1);
    }
  }
  > section.content {
    margin: 31px 26px 0px 31px;
    > p {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      margin-bottom: 14px;
    }
    >div.el-dropdown{
      margin: 0 0 20px 2px;
      span{
        line-height: 1;
        font-size:16px;
        font-family:Microsoft YaHei;
        color:rgba(255,255,255,1);
        cursor: pointer;
        i{
          color: rgba(158,185,239,1);
          font-weight: bold;
          transition: transform 0.2s linear;
          &.rotate{
            transform: rotate(180deg);
          }
        }
      }
    }
    ul {
      li {
        width: 100%;
        padding: 14px 31px 15px 18px;
        background: rgba(251, 251, 251, 1);
        border-radius: 10px;
        margin-bottom: 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
          display: flex;
          &.left {
            justify-content: flex-start;
            align-items: center;
            img {
              width: 37px;
              height: 37px;
              margin-right: 24px;
            }
            p {
              font-size: 18px;
              font-family: MicrosoftYaHei;
              font-weight: 400;
              color: rgba(22, 42, 84, 1);
            }
          }
          &.right {
            flex-direction: column;
            align-items: flex-end;
            p {
              font-size: 16px;
              font-family: MicrosoftYaHei;
              font-weight: 400;
              line-height: 1;
              &:nth-of-type(1) {
                color: rgba(22, 42, 84, 1);
                margin-bottom: 6px;
              }
              &:nth-of-type(2) {
                color: rgba(153, 153, 153, 1);
              }
            }
          }
        }
        &:hover {
          cursor: pointer;
          box-shadow: 0px 0px 10px #8b7878;
        }
      }
    }
  }
  > section.btn {
    margin: 0 26px 0 30px;
    height: 47px;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    background-image: url("../../../assets/images/longBtnBg.png");
    background-size: 100% 100%;
    text-align: center;
    margin-top: 82px;
    a {
      width: 100%;
      height: 100%;
      display: inline-block;
      color: #fff;
      margin-top: 9px;
    }
  }
}
</style>
