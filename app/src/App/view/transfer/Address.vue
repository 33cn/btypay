<template>
  <div class="address_container" :class="addresses.length==0?'noAddress':'haveAddress'">
    <asset-back title="地址簿" :backPath='"/coin/transfer?coin="+coin'></asset-back>
    <ul v-if="addresses.length>0">
      <li
        v-for="(item,i) in addresses"
        :key="i"
        @contextmenu.prevent="show1($event,item,i)"
        @click="selectedAddress(item.address)"
      >
        <p>{{item.label}}</p>
        <p>{{item.address}}</p>
      </li>
    </ul>
    <div v-if="addresses.length==0" class="noAddress"></div>
    <div v-if="menuIsShow" class="menu" :style="'top:'+delMenu.top+'px;left:'+delMenu.left+'px'">
      <p @click="delHandle">删除</p>
    </div>
    <p>
      <router-link :to="{ name: 'addAddress'}">添加地址</router-link>
    </p>
  </div>
</template>

<script>
import AssetBack from "@/components/AssetBack.vue";
import walletAPI from "@/mixins/walletAPI.js";
import recover from "@/mixins/recover.js";
import { getChromeStorage, setChromeStorage } from "@/libs/chromeUtil"
export default {
  mixins: [walletAPI,recover],
  components: { AssetBack },
  data() {
    return {
      addresses: [
          // { label: "hhhh", address: "qsdfsdfsdfdsfsdfsdfsdfdsf" }
        ],
      delMenu: {
        left: 0,
        top: 0
      },
      menuIsShow: false,
      delItem: {},
      delIndex: null
    };
  },
  methods: {
    selectedAddress(ad) {
      // console.log(ad);
      // this.$router.push({ path: "/coin?coin=bty" });
      this.$router.push({ path: "/coin/transfer?address=" + ad});
    },
    mouseOverHandle() {
      // console.log("rrrrrrr");
    },
    delHandle() {
      this.addresses.splice(this.delIndex, 1);
      setChromeStorage("address", this.addresses).then(res => {
        if (res == "success") {
          this.getAddress()
        }
      });
      this.menuIsShow = false;
    },
    show1(e, item, i) {
      this.delIndex = i;
      // console.log(item)
      // console.log(e)
      this.delMenu.left = e.clientX +5;
      this.delMenu.top = document.documentElement.scrollTop + e.clientY + 5;
      this.menuIsShow = true;
      // alert(1)
    },
    getAddress(){
        getChromeStorage("address").then(res => {
            // console.log(res)
            if (res.address) {
              this.addresses = res.address;
            }
        });
    }
  },
  mounted() {
      // console.log(this.$store.state.Records.assetType)
    this.getAddress()
  }
};
</script>

<style lang='scss'>
.address_container {
  width: 100%;
  height: 100vh;
  background-image: url("../../../assets/images/lightColorBg.png");
  background-size: 100% 100%;
  // &.noAddress{
  //     background-image: url('../../../assets/images/noAddress.png');
  // }
  // &.haveAddress{
  //     background-image: url('../../../assets/images/lightColorBg.png');
  // }
  ul {
    margin: 51px 43px 0 44px;
    height: 320px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
      background: transparent;
    }
    li {
      margin: 0 0px 33px 0;
      cursor: pointer;
      p {
        line-height: 1;
        font-weight: 400;
        font-family: MicrosoftYaHei;
        color: rgba(22, 42, 84, 1);
        &:nth-of-type(1) {
          font-size: 18px;
          margin-bottom: 14px;
        }
        &:nth-of-type(2) {
          font-size: 16px;
          opacity: 0.79;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      &:nth-last-of-type(1) {
        margin-bottom: 0px;
      }
    }
  }
  > p {
    width: calc(100% - 55px);
    margin: 0 26px 0 29px;
    height: 66px;
    background-image: url("../../../assets/images/loginBtn.png");
    background-size: 100% 100%;
    text-align: center;
    padding: 12px 0 18px;
    position: fixed;
    bottom: 47px;
    a {
      width: 100%;
      display: inline-block;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 1;
    }
  }
  > div.noAddress {
    width: 249px;
    height: 281px;
    margin: 30px auto 0;
    background-image: url("../../../assets/images/noAddress.png");
    background-size: 100% 100%;
  }
  > div.menu {
    // width: 50px;
    display: inline-block;
    padding: 5px 20px 5px 20px;
    background-color: #217bf4;
    border-radius: 5px;
    position: absolute;
    // top: 0px;
    // left: 0px;
    p {
      font-size: 14px;
      color: #fff;
    }
  }
}
</style>
