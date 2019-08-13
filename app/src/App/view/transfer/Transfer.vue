<template>
  <div class="transfer_container">
    <asset-back title="BTY转账"></asset-back>
    <!-- <section class="content">
            <div>
                <p class="name">转账金额</p>
                <p class="balance">余额0.00BTY</p>
                <input type="text" placeholder="请输入金额">
            </div>
    </section>-->
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <el-form-item label="转账金额" prop="num">
        <el-input type='number' v-model="form.num" placeholder='请输入金额' autocomplete="off" ></el-input>
        <p class="balance">余额0.00BTY</p>
        <p class="mentionAll">全部提取</p>
      </el-form-item>
      <el-form-item label="收款地址" prop="address">
        <el-input v-model="form.address" placeholder='请输入BTY地址' autocomplete="off"></el-input>
        <img src="../../../assets/images/scan.png" alt="" class="scan">
        <p class="line"></p>
        <img src="../../../assets/images/add.png" alt="" @click="$router.push({name:'address'})" class="add">
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input v-model.number="form.comment" placeholder='选填'></el-input>
        <div class="fee">
            <p>矿工费</p>
            <p>0.001BTY</p>
        </div>
      </el-form-item>
    </el-form>
    <p @click="submitForm('ruleForm')">创建</p>
  </div>
</template>

<script>
import AssetBack from "@/components/AssetBack.vue";
import {createNamespacedHelpers} from 'vuex'
import walletAPI from '@/mixins/walletAPI.js'
import chain33API from '@/mixins/chain33API.js'
import backgroundCommuncation from '@/mixins/backgroundCommuncation.js'
import { dMinFee, addrValidate } from '@/libs/bitcoinAmount.js'
import {eventBus} from '@/libs/eventBus.js'

const {mapState} = createNamespacedHelpers('Account')
export default {
  mixins: [walletAPI, chain33API, backgroundCommuncation],
  components: { AssetBack },
  data() {
    var validateAddress = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入地址"));
      } else {
        if (this.ruleForm.address !== "") {
          this.$refs.ruleForm.validateField("address");
        }
        callback();
      }
    };
    var checkNum = (rule, value, callback) => {
        console.log(value)
      if (!value) {
        return callback(new Error("转账金额不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 0) {
            callback(new Error("金额需大于零"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      
      form: {
        num: "",
        address: "",
        comment: ""
      },
      rules: {
        num: [{ validator: checkNum, trigger: "blur" }],
        address: [{ validator: validateAddress, trigger: "blur" }],
        // comment: [{ validator: checkAge, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$alert('请关注您的资金变动。', '转账成功', {
                confirmButtonText: '知道了',
                closeOnClickModal:true,
                center:true,
                showClose:false,
                callback: action => {
                    this.$message({
                      type: 'info',
                      message: `action: ${ action }`
                    });
                }
            });
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
          this.sendToAddr({
            fee: dMinFee * 1e8,
            privateKey: this.from.hexPrivateKey,
            to: this.form.address,
            note: this.form.comment,
            amount: this.form.num * 1e8,
          }).then(res => {
            // console.log(res)
            this.$serverSucNotify('发送成功，等区块链确认后，等待列表中刷新!')
            this.replyBackground(res)
          })
          } else {
            console.log("error submit!!");
            return false;
          }
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  computed:{
    ...mapState(['accountMap', 'currentAccount']),
  }
};
</script>

<style lang='scss'>
.transfer_container {
  width: 100%;
  height: 100vh;
  background-image: url("../../../assets/images/lightColorBg.png");
  background-size: 100% 100%;
  >form{
      margin: 41px 48px 60px;
      >div{
          margin-bottom: 43px;
          position: relative;
          >label{
                margin-bottom: 6px;
                text-align: left;
                font-size:14px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(22,42,84,1);
                line-height:1;
                margin-left: 10px;
          }
          >div{
              margin-left: 0!important;
              input{
                  padding: 12px 79px 13px 16px;
                  border:1px solid rgba(232, 235, 249, 1);
                  border-radius:10px;
                  font-size:14px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    // color:rgba(206,213,232,1);
                    line-height:1;
                  ::-webkit-input-placeholder { /* Chrome/Opera/Safari */ 
		                color:rgba(206,213,232,1);
		              }
              }
              div.el-form-item__error{
                margin-left: 9px;
                color: #FF785B;
                font-size: 12px;
              }
              p{
                  font-size:14px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                line-height:1;
                position: absolute;
                &.balance{
                    color:rgba(22,42,84,0.53);
                    top: 0px;
                    right: 8px;
                }
                &.mentionAll{
                    font-size: 14px;
                    color:rgba(255,120,91,1);
                    top: 33px;
                    right: 23px;
                    cursor: pointer;
                }
              }
              p.line{
                  width: 1px;
                  height: 25px;
                  position: absolute;
                  top: 29px;
                  right: 45px;
                  background-color: rgba(230,230,230,1);
              }
              img{
                  position: absolute;
                  width: 20px;
                  top: 30px;
                  right: 57px;
                  cursor: pointer;
                  &.add{
                      right: 17px;
                  }
              }
              div.fee{
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-top: 4px;
                  p{
                      position: static;
                      font-size:12px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    color:rgba(22,42,84,0.63);
                    line-height:1;
                    margin-left: 12px;
                    &:nth-of-type(2){
                        margin-right: 30px;
                    }
                  }
              }
          }
      }
  }
  // section.content {
  //   margin: 70px 20.5px 0;
  //   > div {
  //     margin-bottom: 23.5px;
  //     position: relative;
  //     p {
  //       font-size: 18px;
  //       font-family: MicrosoftYaHei;
  //       font-weight: 400;
  //       color: rgba(22, 42, 84, 1);
  //       line-height: 1;
  //       &.name {
  //         margin-bottom: 13px;
  //       }
  //       &.balance {
  //         opacity: 0.53;
  //         position: absolute;
  //         top: 0px;
  //         right: 0px;
  //       }
  //     }
  //     input {
  //       width: 100%;
  //     }
  //   }
  // }
  > p {
    margin: 0px 26px 0 29px;
    padding: 11px 0 19px;
    background-image: url("../../../assets/images/longBtnBg.png");
    background-size: 100% 100%;
    text-align: center;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 1;
  }
}
</style>
