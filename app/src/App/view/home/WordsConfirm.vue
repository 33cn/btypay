<template>
  <div class="wordsConfirm_container">
    <asset-back title style="padding-top:0"></asset-back>
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
        <div @click="createWallet">下一步</div>
      </div>
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
      seedChartsRandom: [],

      seedChartsSelected: []
    };
  },
  computed: {
    seedString() {
      return this.$store.state.Account.seed;
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
      // 省略各种判断
      // if (this.seedStringSelected === this.seedString) {
        this.saveSeed(this.seedString, "password");
        this.$router.push({ name: "WalletIndex" });
        this.$message.success("钱包创建成功！");
      // } else {
      //   this.$message.error("助记词错误！");
      // }
    },
    //保存加密助记词并创建钱包
    saveSeed(seedString, password) {
      const walletObj = this.createHDWallet(seedString);
      console.log(walletObj)
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
  mounted() {
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
    }
    .btn {
      margin: 0 auto;
      margin-top: 20px;
      width: 344px;
      height: 47px;
      background-image: url("../../../assets/images/longBtnBg.png");
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
    margin-top: 15px;
    padding: 0;
    .word-btn.el-button--primary {
      background: #ff6a8b;
      opacity: 1;
      &:hover,
      &:active,
      &:focus {
        background: #ff6a8b;
        opacity: 1;
      }
    }
  }
  .selected-word-btn-group {
    margin-bottom: 10px;
  }
  .word-btn {
    width: auto;
    border-radius: 10px;
    padding: 6px 6px;
    font-size: 18px;
    border: none;
    font-family: MicrosoftYaHei;
    margin-bottom: 5px;
    margin-top: 5px;
    margin-left: 10px;
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
