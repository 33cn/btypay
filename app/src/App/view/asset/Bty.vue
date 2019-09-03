<template>
  <div class="bty_container">
    <home-header></home-header>
    <section class="header">
      <router-link :to="{ name: 'WalletIndex'}">
        <img src="../../../assets/images/back.png" alt />
      </router-link>
      <!-- <p v-if="coin=='game'"><router-link :to="{ name: 'node'}">节点设置</router-link></p> -->
    </section>

    <section class="balance" v-if="coin=='bty'">
      <img src="../../../assets/images/btyLogo.png" alt />
      <div class="balance">
        <p>{{mainAsset.amt| numFilter(4)}}</p>
        <p>≈￥{{mainAsset.amt * mainAsset.price| numFilter(4)}}</p>
      </div>
      <div class="address">
        <p :style="addrIsShowAll?'':'text-overflow: ellipsis;'" ref="address">{{currentAccount.address}}</p>
        <img
          @click="copyHandle($event, currentAccount.address)"
          src="../../../assets/images/copy.png"
          alt
        />
      </div>
    </section>

    <section class="balance" v-else>
      <img src="../../../assets/images/gameLogo.png" alt />
      <div class="balance">
        <p>{{parallelAsset.amt| numFilter(4)}}</p>
        <p>≈￥{{parallelAsset.amt * parallelAsset.price| numFilter(4)}}</p>
      </div>
      <div class="address">
        <p :style="addrIsShowAll?'':'text-overflow: ellipsis;'" ref="address">{{currentAccount.address}}</p>
        <img
          @click="copyHandle($event, currentAccount.address)"
          src="../../../assets/images/copy.png"
          alt
        />
      </div>
    </section>

    <section :class="coin=='bty'?'btn bty':'btn game'">
      <p>
        <router-link :to="{ path: '/coin/transfer?coin='+coin}">转账</router-link>
      </p>
      <p>
        <router-link :to="{ path: '/coin/receipt?coin='+coin}">收款</router-link>
      </p>
      <p v-if="coin=='game'">
        <router-link :to="{ name: 'convert'}">兑换</router-link>
      </p>
    </section>
    <section class="records">
      <ul>
        <template v-for="(item, key, i) in TX_FLAG">
          <li
            :key="key"
            v-if="!(coin =='bty' && item.hideInMain)"
            @click="tabChange(item,i)"
          >{{item.label}}</li>
        </template>
      </ul>
      <div class="line" id="line" ref="line" :style="{left:toLeft}"></div>
      <div ref="txListWrap" class="history">
        <transition name="ani" mode="out-in">
          <component :is="view"></component>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
import HomeHeader from "@/components/HomeHeader.vue";
import All from "@/App/view/asset/record/All.vue";
import Transfer from "@/App/view/asset/record/Transfer.vue";
import Receipt from "@/App/view/asset/record/Receipt.vue";
import Convert from "@/App/view/asset/record/Convert.vue";
import { clip } from "@/libs/clip.js";
import walletAPI from "@/mixins/walletAPI.js";
import chain33API from "@/mixins/chain33API.js";
import { createNamespacedHelpers } from "vuex";
import { TransactionsListEntry, formatTxType } from "@/libs/bitcoinAmount.js";
import { timeFormat } from "@/libs/common";

const { mapState } = createNamespacedHelpers("Account");

export default {
  components: { All, Transfer, Receipt, Convert, HomeHeader },
  mixins: [walletAPI, chain33API],
  data() {
    return {
      view: "All",
      preIndex: 0,
      pervScrollTop: 0,
      perAddrScrollTop:0,
      addrIsShowAll:false,
      nextIsLoading: false,
      loadingData: [],
      coin: "",
      toLeft: null,

      noMoreTx: false,
      lastTx: {},
      currentTab: { label: "全部", val: 0 },

      recordLength: 0
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
    currentTypeTy() {
      return this.castFlag2Typety(this.currentTab.val);
    }
  },
  methods: {
    init() {},
    tabChange(item, i) {
      this.view = item.name;
      let length,
        differ = i - this.preIndex;
      if (this.coin == "game") {
        length = 85 * differ;
      } else if (this.coin == "bty") {
        length = 127.5 * differ;
      }
      this.toLeft = this.$refs.line.offsetLeft + length + "px";
      setTimeout(() => {
        this.preIndex = i;
      }, 300);
      this.currentTab = item;
      this.getNTxFirstTime(this.currentTypeTy, 5);
    },

    onScroll() {
      let scrollTop = this.$refs["txListWrap"].scrollTop;
      let scrollBottom =
        this.$refs["txListWrap"].scrollHeight -
        scrollTop -
        this.$refs["txListWrap"].clientHeight;
      if (this.pervScrollTop - scrollTop < 0) {
        // near the bottom
        if (scrollBottom <= 0 && !this.nextIsLoading) {
          // do something
          this.getNtxAfterLast(this.currentTypeTy, 5);
        }
      }
      this.pervScrollTop = scrollTop;
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

    getNTxFirstTime(typeTy, n) {
      let txList = [];
      this.$store.commit("Records/UPDATE_RECORDS", []);
      this.recordLength = 0;
      this.getTxList(this.coin, typeTy, 0, true, cursor => {
        if (cursor && n !== 0) {
          txList.push(cursor.value);
          n--;
          this.recordLength++;
          cursor.continue();
        } else if (!cursor || n === 0) {
          this.$store.commit("Records/UPDATE_RECORDS", txList);
        }
      });
    },
    getNtxAfterLast(typeTy, n) {
      let txList = [];
      let advancing = true;
      this.getTxList(this.coin, typeTy, this.recordLength, false, cursor => {
        if (cursor && n !== 0) {
          txList.push(cursor.value);
          n--;
          this.recordLength++;
          cursor.continue();
        } else if (!cursor || n === 0) {
          this.$store.commit("Records/LOADING_RECORDS", txList);
        }
      });
    },
    addressScroll(e){
      // console.log(this.$refs["address"].scrollLeft )
      if(this.$refs["address"].scrollLeft - this.perAddrScrollTop >= 0){
        this.addrIsShowAll = true;
      }else if(this.$refs["address"].scrollLeft < 10){
        this.addrIsShowAll = false;
      }
      this.perAddrScrollTop = this.$refs["address"].scrollLeft;
    }
  },
  mounted() {
    this.$nextTick(()=>{
      setTimeout(() => {
        this.$refs["address"].addEventListener("scroll", this.addressScroll,false);
      }, 0);
    })
    this.refreshMainAsset();
    this.refreshParallelAsset();
    this.coin = this.$route.query.coin;
    this.$refs["txListWrap"].addEventListener("scroll", this.onScroll);
    let url =
      this.coin == "bty" ? this.currentMain.url : this.currentParallel.url;
    this.$chain33Sdk.httpProvider.setUrl(this.currentMain.url);


    this.getNTxFirstTime(this.currentTypeTy, 5);
  },
  beforeDestroy() {
    this.$refs["txListWrap"].removeEventListener("scroll", this.onScroll);
  }
};
</script>

<style lang='scss'>
.bty_container {
  width: 100%;
  height: 100vh;
  // background-image: url('../../../assets/images/assetOperateBg.png');
  // background-size: 100% 100%;
  position: relative;
  > section.header {
    padding: 5px 29px 0 46px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
    position: relative;
    p {
      font-size: 15px;
      font-family: MicrosoftYaHei-Bold;
      font-weight: bold;
      a {
        color: rgba(245, 185, 71, 1);
      }
    }
    img {
      width: 25px;
      height: 23px;
    }
  }
  > section.balance {
    // width: 100%;
    position: relative;
    // left: calc(50% - 32px);
    // top: 109px;
    top: -28px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > img {
      width: 37px;
      margin-bottom: 5px;
    }
    div {
      display: flex;
      &.balance {
        flex-direction: column;
        align-items: center;
        p {
          font-size: 19px;
          //   height: 18px;
          font-family: MicrosoftYaHei;
          font-weight: 400;
          color: rgba(22, 42, 84, 1);
          line-height: 1;
          &:nth-of-type(2) {
            margin-top: 5px;
            font-size: 16.5px;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
      &.address {
        width: 222px;
        margin: 15px 0 0;
        justify-content: center;
        align-items: center;
        position: relative;

        p {
          width: 100%;
          padding: 5px 24px 6px 23px;
          height: 25px;
          background: rgba(255, 255, 255, 1);
          border-radius: 10px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          font-weight: 400;
          color: rgba(22, 42, 84, 1);
          overflow: auto;
          // text-overflow: ellipsis;
          /* 设置滚动条的样式 */
          &::-webkit-scrollbar {
            width: 0px;
            height: 0px;
            background: transparent;
          }
          /* 滚动条滑块 */
          &::-webkit-scrollbar-thumb {
            background: transparent;
            border-radius: 2px;
            opacity: 0.2;
          }
        }
        img {
          width: 22px;
          height: 22px;
          position: absolute;
          left: 245px;
          cursor: pointer;
        }
      }
    }
  }
  > section.btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -5px;
    p {
      height: 47px;
      text-align: center;
      background-size: 100% 100%;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      // background-image: url('../../../assets/images/transferBtnBg.png');
      background-size: 100% 100%;
      a {
        width: 100%;
        height: 100%;
        padding-top: 8px;
        display: inline-block;
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
      }
    }
    &.game {
      margin: 0 43px;
      p {
        width: 76px;
        background-image: url("../../../assets/images/gameBtn.png");
      }
    }
    &.bty {
      margin: 0 46px;
      p {
        width: 102px;
        background-image: url("../../../assets/images/gameBtn.png");
      }
    }
  }
  > section.records {
    width: 100%;
    // overflow-x: hidden;
    background-color: #fff;
    height: 276px;
    margin-top: 21.5px;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    position: relative;
    > ul {
      margin: 0px 58px 0px 55px;
      padding: 17px 0 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      li {
        color: rgba(33, 123, 244, 1);
        cursor: pointer;
      }
    }
    > div.line {
      width: 25px;
      height: 3px;
      // background:linear-gradient(90deg,rgba(115,248,253,1),rgba(128,164,253,1));
      background: #f5b947;
      position: absolute;
      top: 43px;
      left: 55px;
      transition: all 0.3s linear;
    }
    > div.history {
      overflow-y: auto;
      max-height: 219px;
      margin: 0px 21px 0 20px;
      /* 设置滚动条的样式 */
      &::-webkit-scrollbar {
        width: 2px;
        height: 0px;
        background: transparent;
      }
      // /* 滚动槽 */
      // &::-webkit-scrollbar-track {
      // //   border-radius: $--border-radius-base;
      //   background: transparent;
      // }
      // /* 滚动条滑块 */
      &::-webkit-scrollbar-thumb {
        background: red;
        border-radius: 2px;
        opacity: 0.2;
      }
      // &::-webkit-scrollbar-thumb:window-inactive {
      //   background:rgba(74,125,180,.2);
      // //   border-radius:4px;
      //   opacity: 0.2;
      // }
    }
  }
  .ani-enter {
    transform: translateX(-100%);
  }
  .ani-enter-to {
    transform: translateX(0%);
  }
  .ani-enter-active,
  .ani-leave-active {
    transition: transform 0.3s ease;
  }
  .ani-leave {
    transform: translateX(0%);
  }
  .ani-leave-to {
    transform: translateX(100%);
  }
}
</style>
