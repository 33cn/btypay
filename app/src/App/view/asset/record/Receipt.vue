<template>
  <div class="receiptRecord_Container">
    <ul>
      <li v-for="item in list" :key="item.time" @click="toDetail(item)">
        <div>
          <!-- <img v-if="item.type==1" src="../../../../assets/images/transferLogo.png" alt=""> -->
          <img src="../../../../assets/images/receiptLogo.png" alt />
          <!-- <img v-if="item.type==3" style="width:27px;height:28px" src="../../../../assets/images/convertLogo.png" alt=""> -->
          <!-- <img :src="item.type==1?'../../../../assets/images/receiptLogo.png':'../../../../assets/images/transferLogo.png'" alt=""> -->
          <div>
            <p>{{item.hashShort}}</p>
            <p>{{item.strTimeData}} &nbsp; 收款</p>
          </div>
        </div>
        <p
          :class="item.amountChangeType == 'decrease' ?'transfer':'receipt'"
        >+{{item.strAmount | numFilter}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
// import {createNamespacedHelpers} from 'vuex'
// const {mapState} = createNamespacedHelpers('Records')
import records from "@/mixins/records.js";
export default {
  mixins: [records]
};
</script>

<style lang='scss'>
.receiptRecord_Container {
  ul {
    li {
      background: rgba(243, 246, 251, 1);
      box-shadow: 0px 10px 10px -5px #d6d4d4;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 37px 9px 35px;
      margin-bottom: 20px;
      border-radius: 10px;
      cursor: pointer;
      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          width: 28px;
          height: 25px;
          margin-right: 18px;
        }
        div {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          p {
            font-family: MicrosoftYaHei;
            font-weight: 400;
            line-height: 1;
            &:nth-of-type(1) {
              // width: 90px;
              font-size: 14px;
              color: rgba(51, 51, 51, 1);
              margin-bottom: 4px;
              // overflow: hidden;
              // text-overflow: ellipsis;
              line-height: 1.2;
            }
            &:nth-of-type(2) {
              font-size: 12px;
              color: rgba(171, 177, 193, 0.62);
            }
          }
        }
      }
      p {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        line-height: 1;
        // margin-right: 25px;
        &.transfer {
          color: rgba(59, 225, 237, 1);
        }
        &.receipt {
          color: rgba(255, 179, 89, 1);
        }
      }
    }
  }
}
</style>
