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
      seedCharts: [],

      yyy: {
        ty: 2,
        tyName: "ExecOk",
        logs: [
          {
            ty: 2,
            tyName: "LogFee",
            log: {
              prev: {
                currency: 0,
                balance: "304999890",
                frozen: "0",
                addr: "1GUhbeySSNywQcGcsjhPPXMX7iRZ6P6ovb"
              },
              current: {
                currency: 0,
                balance: "304899890",
                frozen: "0",
                addr: "1GUhbeySSNywQcGcsjhPPXMX7iRZ6P6ovb"
              }
            },
            rawLog:
              "0x0a2a10d2dbb7910122223147556862657953534e797751634763736a685050584d583769525a3650366f7662122a10b2ceb1910122223147556862657953534e797751634763736a685050584d583769525a3650366f7662"
          },
          {
            ty: 3,
            tyName: "LogTransfer",
            log: {
              prev: {
                currency: 0,
                balance: "304899890",
                frozen: "0",
                addr: "1GUhbeySSNywQcGcsjhPPXMX7iRZ6P6ovb"
              },
              current: {
                currency: 0,
                balance: "304799890",
                frozen: "0",
                addr: "1GUhbeySSNywQcGcsjhPPXMX7iRZ6P6ovb"
              }
            },
            rawLog:
              "0x0a2a10b2ceb1910122223147556862657953534e797751634763736a685050584d583769525a3650366f7662122a1092c1ab910122223147556862657953534e797751634763736a685050584d583769525a3650366f7662"
          },
          {
            ty: 3,
            tyName: "LogTransfer",
            log: {
              prev: {
                currency: 0,
                balance: "1012843360110",
                frozen: "0",
                addr: "1HPkPopVe3ERfvaAgedDtJQ792taZFEHCe"
              },
              current: {
                currency: 0,
                balance: "1012843460110",
                frozen: "0",
                addr: "1HPkPopVe3ERfvaAgedDtJQ792taZFEHCe"
              }
            },
            rawLog:
              "0x0a2b10eedeac91bd1d22223148506b506f7056653345526676614167656444744a5137393274615a4645484365122b108eecb291bd1d22223148506b506f7056653345526676614167656444744a5137393274615a4645484365"
          },
          {
            ty: 8,
            tyName: "LogExecDeposit",
            log: {
              execAddr: "1HPkPopVe3ERfvaAgedDtJQ792taZFEHCe",
              prev: {
                currency: 0,
                balance: "300000",
                frozen: "0",
                addr: "1GUhbeySSNywQcGcsjhPPXMX7iRZ6P6ovb"
              },
              current: {
                currency: 0,
                balance: "400000",
                frozen: "0",
                addr: "1GUhbeySSNywQcGcsjhPPXMX7iRZ6P6ovb"
              }
            },
            rawLog:
              "0x0a223148506b506f7056653345526676614167656444744a5137393274615a4645484365122810e0a71222223147556862657953534e797751634763736a685050584d583769525a3650366f76621a281080b51822223147556862657953534e797751634763736a685050584d583769525a3650366f7662"
          }
        ]
      },
      xxx: {
        ty: 2,
        tyName: "ExecOk",
        logs: [
          {
            ty: 2,
            tyName: "LogFee",
            log: {
              prev: {
                currency: 0,
                balance: "305199890",
                frozen: "0",
                addr: "1GUhbeySSNywQcGcsjhPPXMX7iRZ6P6ovb"
              },
              current: {
                currency: 0,
                balance: "305099890",
                frozen: "0",
                addr: "1GUhbeySSNywQcGcsjhPPXMX7iRZ6P6ovb"
              }
            },
            rawLog:
              "0x0a2a1092f6c3910122223147556862657953534e797751634763736a685050584d583769525a3650366f7662122a10f2e8bd910122223147556862657953534e797751634763736a685050584d583769525a3650366f7662"
          },
          {
            ty: 3,
            tyName: "LogTransfer",
            log: {
              prev: {
                currency: 0,
                balance: "305099890",
                frozen: "0",
                addr: "1GUhbeySSNywQcGcsjhPPXMX7iRZ6P6ovb"
              },
              current: {
                currency: 0,
                balance: "304999890",
                frozen: "0",
                addr: "1GUhbeySSNywQcGcsjhPPXMX7iRZ6P6ovb"
              }
            },
            rawLog:
              "0x0a2a10f2e8bd910122223147556862657953534e797751634763736a685050584d583769525a3650366f7662122a10d2dbb7910122223147556862657953534e797751634763736a685050584d583769525a3650366f7662"
          },
          {
            ty: 3,
            tyName: "LogTransfer",
            log: {
              prev: {
                currency: 0,
                balance: "1012843260110",
                frozen: "0",
                addr: "1HPkPopVe3ERfvaAgedDtJQ792taZFEHCe"
              },
              current: {
                currency: 0,
                balance: "1012843360110",
                frozen: "0",
                addr: "1HPkPopVe3ERfvaAgedDtJQ792taZFEHCe"
              }
            },
            rawLog:
              "0x0a2b10ced1a691bd1d22223148506b506f7056653345526676614167656444744a5137393274615a4645484365122b10eedeac91bd1d22223148506b506f7056653345526676614167656444744a5137393274615a4645484365"
          },
          {
            ty: 8,
            tyName: "LogExecDeposit",
            log: {
              execAddr: "1HPkPopVe3ERfvaAgedDtJQ792taZFEHCe",
              prev: {
                currency: 0,
                balance: "200000",
                frozen: "0",
                addr: "1GUhbeySSNywQcGcsjhPPXMX7iRZ6P6ovb"
              },
              current: {
                currency: 0,
                balance: "300000",
                frozen: "0",
                addr: "1GUhbeySSNywQcGcsjhPPXMX7iRZ6P6ovb"
              }
            },
            rawLog:
              "0x0a223148506b506f7056653345526676614167656444744a5137393274615a4645484365122810c09a0c22223147556862657953534e797751634763736a685050584d583769525a3650366f76621a2810e0a71222223147556862657953534e797751634763736a685050584d583769525a3650366f7662"
          }
        ]
      }
    };
  },
  methods: {
    //生成助记词
    generateSeed() {
      this.seedString = this.newMnemonic(2);
      console.log(this.seedString);
      this.seedCharts = this.seedString.split(" ");
      this.$store.commit("Account/UPDATE_SEED", this.seedString);
    }
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
      font-family: MicrosoftYaHei;
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
          font-family: MicrosoftYaHei;

          &:nth-child(-n + 4) {
            margin-top: 0;
          }
          &:nth-child(4n) {
            margin-right: 0;
          }
        }
      }
    }
    .btn {
      margin-top: 48px;
      height: 66px;
      background-image: url("../../../assets/images/loginBtn.png");
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
