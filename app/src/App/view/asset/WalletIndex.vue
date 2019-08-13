<template>
  <div class="walletIndex_container">
    <home-header></home-header>
    <p>
      <router-link :to="{ name: 'node'}">节点设置</router-link>
    </p>
    <section class="content">
      <p>我的资产</p>
      <ul>
        <li @click="toBty">
          <div class="left">
            <img src="../../../assets/images/btyLogo.png" alt />
            <p>BTY</p>
          </div>
          <div class="right">
            <p>0.00</p>
            <p>≈￥0.00</p>
          </div>
        </li>
        <li @click="toGame">
          <div class="left">
            <img src="../../../assets/images/gameLogo.png" alt />
            <p>GAME</p>
          </div>
          <div class="right">
            <p>0.00</p>
            <p>≈￥0.00</p>
          </div>
        </li>
        <!-- <li v-for="(item, index) in GameAsset" :key="index">
          <div class="left">
            <img src="../../../assets/images/logo.png" alt />
            <p>{{ item.name }}</p>
          </div>
          <div class="right">
            <p>{{ item.num }}</p>
            <p>≈￥0.00</p>
          </div>
        </li> -->
      </ul>
    </section>
    <section class="btn"><router-link :to="{ name: 'ImportWallet'}">导入钱包</router-link></section>
  </div>
</template>

<script>
import HomeHeader from "@/components/HomeHeader.vue";
export default {
  components: { HomeHeader },
  data() {
    return {
      BTYAsset: 0,
      GameAsset: [
        { name: "", num: 0 }
      ]
    };
  },
  methods: {
    toBty() {
      this.$router.push({ path: "/coin?coin=bty" });
    },
    toGame() {
      this.$router.push({ path: "/coin?coin=game" });
    }
  }
};
</script>

<style lang='scss'>
.walletIndex_container {
  > p {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold;
    font-weight: bold;
    position: absolute;
    right: 27px;
    top: 138px;
    a {
      color: rgba(245, 185, 71, 1);
    }
  }
  > section.content {
    margin: 60px 26px 0px 31px;
    > p {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      margin-bottom: 14px;
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
              width:37px;
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
        &:hover{
          cursor: pointer;
        }
      }
    }
  }
  >section.btn{
    margin: 0 26px 0 30px;
    height: 47px;
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    background-image: url('../../../assets/images/longBtnBg.png');
    background-size: 100% 100%;
    text-align: center;
    margin-top: 82px;
    a{
      width: 100%;
      height: 100%;
      display: inline-block;
      color: #fff;
      margin-top: 9px;
    }
  }
}
</style>
