<template>
  <div class="wordsConfirm_container">
    <asset-back title style="padding-top:0" backPath="/WordsShow"></asset-back>
    <section class="content">
      <p class="desc">请按顺序确认您的助记词</p>
      <div class="mnemonic">
        <dargable-btn-group v-model="seedChartsSelected" :lang="1"></dargable-btn-group>
      </div>
      <div class="mnemonic-select">
        <el-button
          class="word-btn"
          v-for="(item, index) of seedChartsRandom"
          :key="index"
          :type="item.selected ? 'primary' : ''"
          @click="toggleChart(item)"
        >{{item.value}}</el-button>
      </div>

      <div class="btn">
        <div @click="createWallet">确认{{isConfirming?'...':''}}</div>
      </div>
    </section>
  </div>
</template>

<script>
import DargableBtnGroup from "@/components/DragableBtnGroup.vue";
import AssetBack from "@/components/AssetBack.vue";
import { randomSort, addPropToArrElem } from "@/libs/common.js";
import { encrypt } from "@/libs/crypto.js";
import {setChromeStorage} from '@/libs/chromeUtil.js'
import recover from "@/mixins/recover.js";
import walletAPI from "@/mixins/walletAPI.js";
export default {
  components: { AssetBack, DargableBtnGroup },
  mixins:[walletAPI,recover],
  data() {
    return {
      isConfirming:false,
      seedCharts: [],
      seedChartsRandom: [],
      isCreating:false,
      seedChartsSelected: []
    };
  },
  computed: {
    seedString() {
      return this.$store.state.Account.seed;
    },
    mainUrl(){
      return this.$store.state.Account.currentMain;
    },
    seedStringSelected: function() {
      let s = "";
      for (let i = 0; i < this.seedChartsSelected.length; i++) {
        s += ` ${this.seedChartsSelected[i].value}`;
      }
      return s.trim();
    }
  },
  methods: {
    //创建钱包
    createWallet() {
      // this.isConfirming = true;
      // 省略各种判断
      if (this.seedStringSelected === this.seedString) {
        this.saveSeed(this.seedString, this.$store.state.Account.password);
        // // 保存登录时间
        // setChromeStorage('loginTime',(new Date()).valueOf()).then(res=>{
        //   console.log(res)
        // })
        // this.isConfirming = false
        this.$message.success("钱包创建成功！");
        setTimeout(() => {
          this.$router.push({ name: "WalletIndex" });
        }, 500);
      } else {
        // this.isConfirming = false;
        this.$message.error("助记词错误！");
      }
    },
    //保存加密助记词并创建钱包
    saveSeed(seedString, password) {
      const walletObj = this.createHDWallet(seedString);
      // this.setPasswd('',password,this.mainUrl.url).then(res=>{
      //   console.log('111111111111111111111')
      //   console.log(res)
      // }).catch(err=>{
      //   console.log('22222222222222222222222')
      //   console.log(err)
      // })
      // console.log(walletObj)
      // 加密助记词
      let ciphertext = encrypt(seedString, password);
      window.chrome.storage.local.set({ciphertext: ciphertext}, () => {
        // console.log('ciphertext is set to ' + ciphertext);
      })
      this.newAccount("创世地址");
      return walletObj;
    },
    toggleChart(item) {
      if (item.selected) {
        let i = this.seedChartsSelected.indexOf(item);
        this.seedChartsSelected.splice(i, 1);
      } else {
        this.seedChartsSelected.push(item);
      }
      item.selected = !item.selected;
    }
  },
  mounted() {
    // console.log(this.$store.state.Account.password)
    this.seedCharts = this.seedString.split(" ");
    this.seedChartsRandom = addPropToArrElem(
      randomSort(this.seedCharts),
      "selected",
      false
    );
    // this.createWallet();
  }
};
</script>

<style lang='scss'>
.wordsConfirm_container {
  .content {
    width: 344px;
    margin: 0 auto;
    margin-top: 19px;
    .desc {
      font-size: 16px;
      color: #ffffff;
      font-family: MicrosoftYaHei;
    }
    .btn {
      margin: 0 auto;
      margin-top: 20px;
      width: 344px;
      height: 66px;
      background-image: url("../../../assets/images/loginBtn.png");
      background-size: 100% 100%;
      text-align: center;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      padding-top: 5px;
      > div {
        &:hover {
          cursor: pointer;
        }
        width: 100%;
        display: inline-block;
        color: rgba(255, 255, 255, 1) !important;
        margin-top: 3px;
      }
    }
  }

  .mnemonic {
    margin: 11.5px 0;
    box-shadow: 2px 2px 5px 3px #ffffff;
    border-radius: 10px;
    background: white;
    min-height: 190px;
    display: flex;
    align-content: center;
    align-items: center;
    font-family: MicrosoftYaHei;
    .word-btn_combine {
      flex: 0;
      width: auto;
      margin-left: 10px;
      padding: 10px 12px;
      color: #ffffff;
      font-size: 27px;
      border: none;
      border-radius: 0;
    }
    .word-btn:focus {
      color: #ffffff;
      background: #ff89a3;
      opacity: 1;
    }
    .word-btn:active {
      color: #ffffff;
      background: #ff89a3;
    }
  }
  .mnemonic-select {
    margin-top: 15px;
    padding: 0 25px;
    font-family: MicrosoftYaHei;
    .word-btn.el-button--primary {
      background: #FF6A8B;
      &:hover,
      &:active,
      &:focus {
        background: #FF6A8B;
      }
    }
  }
  .selected-word-btn-group {
    margin-bottom: 10px;
  }
  .word-btn {
    width: 61px;
    line-height: 21px;
    border-radius: 4px;
    padding: 0;
    font-size: 12px;
    border: none;
    font-family: MicrosoftYaHei;
    margin-bottom: 5px;
    margin-top: 5px;
    margin-left: 16px;
    color: #ffffff;
    background: #F8A7BC;
    &:hover {
      color: #ffffff;
      background: #F8A7BC;
    }
    &:nth-child(4n + 1){
      margin-left: 0;
    }
  }
  .el-button--primary{
    box-shadow: none;
  }
}
</style>
