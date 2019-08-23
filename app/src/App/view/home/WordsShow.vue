<template>
  <div class="wordsShow_container">
    <asset-back title style="padding-top:0"></asset-back>
    <section class="content">
      <p class="notice">请记录下您的助记词，并妥善保存，建议通过纸笔的方式。不建议截图保存，会对您的资金安全造成威胁。</p>
      <div class="mnemonic-con">
        <!-- <div class="mnemonic">
          <span v-for="(item, index) in seedCharts" :key="index">{{item}}</span>
        </div>-->
        <div class="mnemonic">
          <span v-for="(item, index) in seedCharts" :key="index">{{item}}</span>
        </div>
      </div>
      <p class="btn">
        <router-link :to="{ name: 'WordsConfirm'}">下一步</router-link>
      </p>
    </section>
  </div>
</template>

<script>
import AssetBack from "@/components/AssetBack.vue";
// import { randomSort, addPropToArrElem, getLocalLang } from '@/libs/common.js'
// import {encrypt} from '@/libs/crypto.js'
export default {
  components: { AssetBack },
  data() {
    return {
      seedString: "",
      seedCharts: []
    };
  },
  methods: {
    //生成助记词
    generateSeed() {
      this.seedString = this.newMnemonic(2);
      console.log(this.seedString)
      this.seedCharts = this.seedString.split(" ");
      this.$store.commit("Account/UPDATE_SEED", this.seedString);
    }
    // //创建钱包
    // createWallet(){
    //     // 省略各种判断
    //     this.saveSeed(seedString, 'password');

    // },
    // //保存加密助记词并创建钱包
    // saveSeed(seedString,password){
    //     const walletObj = this.createHDWallet(seedString);
    //     // 加密助记词
    //     let ciphertext = encrypt(seedString, password);
    //     window.chrome.storage.local.set({ciphertext: ciphertext}, () => {})
    //     // this.newAccount('创世地址');
    //     return walletObj;
    // }
  },
  computed: {},
  watch: {
    // seedString(val){
    // this.seedCharts = val.split(' ');
    // },
  },
  mounted() {
    this.generateSeed();
  }
};
</script>

<style lang='scss'>
.wordsShow_container {
  .content {
    width: 344px;
    margin: 0 auto;
    margin-top: 30px;
    .notice {
      font-size: 14px;
      color: #ffffff;
      margin-bottom: 11px;
      line-height: 20px;
    }
    .mnemonic-con {
      height: 190px;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 2px 2px 5px 3px #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      .mnemonic {
        width: 300px;
        > span {
          font-size: 12px;
          line-height: 21px;
          width: 61px;
          color: #ff6a8b;
          display: inline-block;
          text-align: center;
          margin-right: 15px;
          margin-top: 16px;
          // background: #334654;
          border-radius: 4px;

          &:nth-child(-n + 4){
            margin-top: 0;
          }
          &:nth-child(4n){
            margin-right: 0;
          }
        }
      }
    }
    .btn {
      margin-top: 48px;
      height: 43.5px;
      background-image: url("../../../assets/images/longBtnBg.png");
      background-size: 100% 100%;
      text-align: center;
      font-size: 16.8px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      // padding-top: 4px;
      a {
        width: 100%;
        height: 100%;
        display: inline-block;
        color: rgba(255, 255, 255, 1) !important;
        padding-top: 11px;
      }
    }
  }
}
</style>
