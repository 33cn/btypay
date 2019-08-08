<template>
  <div class="walletIndex_container">
    <home-header></home-header>
    <header>
      <p></p>
      <p>
        <router-link :to="{ name: 'node'}">节点设置</router-link>
      </p>
    </header>
    <section class="content">
      <p>我的资产</p>
      <ul>
        <li @click="toBty">
          <div class="coin">
            <span class="icon"></span>
            <span class="name">BTY</span>
          </div>
          <div class="price">
            <p>0.00</p>
            <p>≈￥0.00</p>
          </div>
        </li>
        <li @click="toGame">GAME</li>
      </ul>
    </section>
  </div>
</template>

<script>
import HomeHeader from "@/components/HomeHeader.vue";
export default {
  components: { HomeHeader },
  methods: {
    toBty() {
      this.$router.push({ name: "bty" });
    },
    toGame() {
      this.$router.push({ name: "gameCoin" });
    }
  }
};
</script>

<style lang='scss'>
.walletIndex_container {
  > header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 29.1px;
    > p {
      > a {
        color: #f5b947;
        font-size: 18.4px;
        font-weight: bold;
      }
    }
  }
  > section.content {
    > p {
      padding: 55px 0 15.3px 28.4px;
      color: #ffffff;
      font-size: 21.5px;
    }
    ul {
      margin: 0 28.4px;
      li {
        height: 66px;
        background: #ffffff;
        margin-bottom: 15px;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 19.1px !important;
        .coin {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .icon {
            width: 36px;
            height: 36px;
            background: #f5b947;
            margin-right: 23.8px;
            border-radius: 36px;
            display: inline-block;
          }
          .name {
            font-size: 20px;
            color: #162a54;
          }
        }
        .price {
          font-size: 20px;
          color: #162a54;
          text-align: right;
          line-height: 24px;
          > p:nth-of-type(2) {
            color: #999999;
          }
        }
      }
    }
  }
}
</style>
