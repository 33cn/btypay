<template>
  <div class="wordsConfirm_container">
    <asset-back title="" style="padding-top:0"></asset-back>
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

      <p class="btn">
        <router-link :to="{ name: 'WalletIndex'}">下一步</router-link>
      </p>
    </section>
  </div>
</template>

<script>
import DargableBtnGroup from "@/components/DragableBtnGroup.vue";
import AssetBack from "@/components/AssetBack.vue";
import { randomSort, addPropToArrElem } from "@/libs/common.js";
import { encrypt } from "@/libs/crypto.js";
export default {
  components: { AssetBack, DargableBtnGroup },
  data() {
    return {
      seedCharts: [],
      seedChartsRandom: [
        { value: "织", selected: false },
        { value: "狂", selected: false },
        { value: "换", selected: false },
        { value: "建", selected: false },
        { value: "讯", selected: false },
        { value: "春", selected: false },
        { value: "症", selected: false },
        { value: "掷", selected: false },
        { value: "些", selected: false },
        { value: "官", selected: false },
        { value: "插", selected: false },
        { value: "气", selected: false },
        { value: "丽", selected: false },
        { value: "声", selected: false },
        { value: "忧", selected: false }
      ],

      seedChartsSelected: []
    };
  },
  methods: {
    //创建钱包
    createWallet() {
      // 省略各种判断
      this.saveSeed(this.seedString, "password");
    },
    //保存加密助记词并创建钱包
    saveSeed(seedString, password) {
      const walletObj = this.createHDWallet(seedString);
      // 加密助记词
      let ciphertext = encrypt(seedString, password);
      // window.chrome.storage.local.set({ciphertext: ciphertext}, () => {})
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
  computed: {
    seedString() {
      return this.$store.state.Account.seed;
    }
  },
  mounted() {
    // this.seedCharts = this.seedString.split(" ");
    // this.seedChartsRandom = addPropToArrElem(
    //   randomSort(this.seedCharts),
    //   "selected",
    //   false
    // );
    // this.createWallet();
  }
};
</script>

<style lang='scss'>
.wordsConfirm_container {
  .content {
    width: 350px;
    margin: 0 auto;
    margin-top: 23px;
    .desc {
      font-size: 18.5px;
      color: #ffffff;
    }
    .btn {
      margin-top: 60px;
      height: 43.5px;
      background-image: url("../../../assets/images/longBtnBg.png");
      background-size: 100% 100%;
      text-align: center;
      font-size: 21px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      a {
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
    padding: 10px 0;
    background: white;
    height: 205px;
    display: flex;
    position: relative;
    align-items: center;
    flex-wrap: wrap;
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
      opacity: 1;
    }
  }
  .mnemonic-select {
    margin-top: 32px;
    padding: 0 20px;
    .word-btn.el-button--primary {
      background: #ff6a8b;
      opacity: 1;
    }
  }
  .selected-word-btn-group {
    margin-bottom: 10px;
  }
  .word-btn {
    width: auto;
    border-radius: 10px;
    padding: 6px 6px;
    font-size: 27px;
    border: none;
    font-family: MicrosoftYaHei;
    margin-bottom: 5px;
    margin-top: 10px;
    margin-left: 20px;
    color: #ffffff;
    background: #ff89a3;
    opacity: 0.71;
    &:hover {
      color: #ffffff;
      background: #ff89a3;
      opacity: 1;
    }
  }
}
</style>
