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
        <span class="el-dropdown-link">
          账户一<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a" class="currentAccount">账户一</el-dropdown-item>
          <el-dropdown-item command="b">账户二</el-dropdown-item>
          <el-dropdown-item command="c">账户三</el-dropdown-item>
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
            <p v-if="!numIsAnimation">≈{{ mainAsset.amt * mainAsset.price | numFilter(4)}}{{currency}}</p>
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
            <p v-if="!numIsAnimation">≈{{ parallelAsset.amt * parallelAsset.price | numFilter(4)}}{{currency}}</p>
          </div>
        </li>
      </ul>
    </section>
    <!-- <section class="btn">
      <router-link :to="{ name: 'ImportWallet'}">导入钱包</router-link>
    </section>-->
  </div>
</template>

<script>
import HomeHeader from "@/components/HomeHeader.vue";
import { createNamespacedHelpers } from "vuex";
import walletAPI from "@/mixins/walletAPI.js";
import chain33API from "@/mixins/chain33API.js";
import { eventBus } from "@/libs/eventBus";
import { setChromeStorage } from "@/libs/chromeUtil.js";

const { mapState } = createNamespacedHelpers("Account");

export default {
  mixins: [walletAPI, chain33API],
  components: { HomeHeader },
  data() {
    return {
      delMenu: {
        left: 0,
        top: 0
      },
      menuIsShow: false,
      numIsAnimation:true,
    };
  },
  computed: {
    ...mapState([
      "accountMap",
      "currentAccount",
      "currentMain",
      "currentParallel",
      "mainAsset",
      "parallelAsset",
      "currency"
    ])
  },
  methods: {
    handleCommand(command) {
      this.$message('click on item ' + command);
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
        initial = 0;

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
          document.querySelector('#'+ele).innerHTML = '≈￥'+initial;
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
            this.NumAutoPlusAnimation('btyPrice',{
              time: 1500,
              num: this.numFilter(this.mainAsset.amt*10),
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
              num: this.numFilter(this.parallelAsset.amt*10),
              regulator: 50
            })
          }
        }
      });
    }, 10);
    }
  },
  mounted() {
    this.init();
    // this.recoverAccount();
    this.getBalance()
    this.$store.commit("Records/LOADING_RECORDS", []); //清空记录
    setChromeStorage('element',{}).then(res=>{
        // console.log(res)
    })
    setChromeStorage('beforePath',{}).then(res=>{
      // console.log(res)
    })
    // let tx = '0a15757365722e702e67616d65546573742e636f696e73124f180a2a4b1080c2d72f2220757365722e702e757365722e702e676274746573742e2e7761736d2e646963652a223147556862657953534e797751634763736a685050584d583769525a3650366f76621a6e08011221022e573b4ea5edfacc6c910cfb08f70d4aec7b418bed966590c8f240650f79923e1a473045022100cede87ff1cc13591dbb747206dff068b386c016acfc177f5149afc2c3238d2c402200c2524d0d5b95264e3796f860c5368775ded8a99d57653fee963d95e985bd15a20c09a0c30bf92c4bc96ee89a6683a22313831447942764c36417135744c51516d7279695835623276467947544d4536504240024a82050ad0020a15757365722e702e67616d65546573742e636f696e73124f180a2a4b1080c2d72f2220757365722e702e757365722e702e676274746573742e2e7761736d2e646963652a223147556862657953534e797751634763736a685050584d583769525a3650366f76621a6e08011221022e573b4ea5edfacc6c910cfb08f70d4aec7b418bed966590c8f240650f79923e1a473045022100cede87ff1cc13591dbb747206dff068b386c016acfc177f5149afc2c3238d2c402200c2524d0d5b95264e3796f860c5368775ded8a99d57653fee963d95e985bd15a20c09a0c30bf92c4bc96ee89a6683a22313831447942764c36417135744c51516d7279695835623276467947544d4536504240024a203fbe4fca37b584ff8bdf5aba3dc3f606dd69eaecf939c3829b472d3a2c2b27dd5220167862ab535edd15435c7bca8d7e09ab4e77d544f6737d97c3d72e61670803c60aac020a17757365722e702e67616d65546573742e6c6f747465727912505002124c0a42307831663261333331343930623261313464353966313933346138373461393338303363613761306235643864626435353664303036316333366263623736363665100118db930420051a6d08011221022e573b4ea5edfacc6c910cfb08f70d4aec7b418bed966590c8f240650f79923e1a46304402204843c9d287240a6bb28507c7e35b82c0a7eb2b934e4c44631eca56373481cd3d02201da03281812ecff8701c8afc8eb96aa3165df8359cfa24b5ef8d0bc99368d5e230fedf92afb4c1b5eb7e3a22314442756359366d57486d6e706251574c503177546142315676705536423373434a40024a203fbe4fca37b584ff8bdf5aba3dc3f606dd69eaecf939c3829b472d3a2c2b27dd5220167862ab535edd15435c7bca8d7e09ab4e77d544f6737d97c3d72e61670803c6'
    // this.sendTransaction(tx,'https://jiedian1.bityuan.com:8801/').then(res=>{
    //   console.log('()()()()()()()()()(')
    //   console.log(res)
    // }).catch(err=>{
    //   console.log('()()()()()()()()()')
    //   console.log(err)
    //   console.log(JSON.stringify(err))
    //   console.log(JSON.parse(err))
    //   console.log(err.id)
    // })
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
