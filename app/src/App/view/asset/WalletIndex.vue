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
            <img src="../../../assets/images/logo.png" alt />
            <p>BTY</p>
          </div>
          <div class="right">
            <p>0.00</p>
            <p>≈￥0.00</p>
          </div>
        </li>
        <li @click="toGame">
          <div class="left">
            <img src="../../../assets/images/logo.png" alt />
            <p>GAME</p>
          </div>
          <div class="right">
            <p>0.00</p>
            <p>≈￥0.00</p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import HomeHeader from "@/components/HomeHeader.vue";
export default {
    components: { HomeHeader },
    methods:{
        toBty(){
            this.$router.push({path:'/coin?coin=bty'})
        },
        toGame(){
            this.$router.push({path:'/coin?coin=game'})
        }
    }
}
</script>

<style lang='scss'>
.walletIndex_container {
  > p {
    font-size: 18px;
    font-family: MicrosoftYaHei-Bold;
    font-weight: bold;
    position: absolute;
    right: 38px;
    top: 102px;
    a {
      color: rgba(245, 185, 71, 1);
    }
  }
  > section.content {
    margin: 59px 29px 0px;
    > p {
      font-size: 21px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      margin-bottom: 15px;
    }
    ul {
      li {
        width: 100%;
        padding: 15px 23px 15px 19px;
        background: rgba(251, 251, 251, 1);
        border-radius: 10px;
        margin-bottom: 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
          display: flex;
          &.left {
            justify-content: flex-start;
            align-items: center;
            img {
              width: 36px;
              height: 36px;
              margin-right: 23px;
            }
            p {
              font-size: 20px;
              font-family: MicrosoftYaHei;
              font-weight: 400;
              color: rgba(22, 42, 84, 1);
            }
          }
          &.right {
            flex-direction: column;
            align-items: flex-end;
            p {
              font-size: 20px;
              font-family: MicrosoftYaHei;
              font-weight: 400;
              line-height: 1;
              &:nth-of-type(1) {
                color: rgba(22, 42, 84, 1);
              }
              &:nth-of-type(2) {
                color: rgba(153, 153, 153, 1);
              }
            }
          }
        }
      }
    }
  }
}
</style>
