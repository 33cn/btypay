<template>
  <div class="transfer_container">
    <asset-back :title="coin=='bty'?'BTY转账':parallelAsset.name+'转账'"></asset-back>
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <el-form-item label="转账金额" prop="num">
        <el-input type='number' v-model="form.num" placeholder='请输入金额' auto-complete="on" ></el-input>
        <p v-if="coin=='bty'" class="balance">余额{{mainAsset.amt| numFilter(2)}}BTY</p>
        <p v-if="coin=='game'" class="balance">余额{{parallelAsset.amt| numFilter(2)}}{{parallelAsset.name}}</p>
        <p v-if="coin=='bty'" class="mentionAll" @click="form.num=mainAsset.amt">全部提取</p>
        <p v-if="coin=='game'" class="mentionAll" @click="form.num=parallelAsset.amt">全部提取</p>
      </el-form-item>
      <el-form-item label="收款地址" prop="address">
        <el-input v-model="form.address" :placeholder='coin=="bty"?"请输入BTY地址":"请输入"+parallelAsset.name+"地址"' auto-complete="off"></el-input>
        <!-- <img src="../../../assets/images/scan.png" alt="" class="scan">
        <p class="line"></p> -->
        <img src="../../../assets/images/add.png" alt="" @click="$router.push({name:'address'})" class="add">
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input v-model.number="form.comment" type="text" placeholder='选填'></el-input>
        <div class="fee">
            <p>矿工费</p>
            <p>0.001BTY</p>
        </div>
      </el-form-item>
    </el-form>
    <p @click="submitForm('ruleForm')">转账{{isCreating?'...':''}}</p>
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
    let validateAddress = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入地址"));
      } 
    };
    let checkNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("转账金额不能为空"));
      }
      setTimeout(() => {
        // console.log(!Number.isInteger(parseFloat(value)))
        if (isNaN(parseFloat(value))) {
          callback(new Error("请输入数字值"));
        } else {
          if (parseFloat(value) < 0) {
            callback(new Error("金额需大于零"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    let checkComment = (rule, value, callback) =>{
      return callback()
    }
    return {
      isCreating:false,
      coin:'',
      form: {
        num: null,
        address: "",
        comment: ""
      },
      rules: {
        num: [{ required: true, message: "请输入转账金额", trigger: "blur" },{ validator: checkNum, trigger: "blur" }],
        address: [{ required: true, message: "请输入转账地址", trigger: "blur" }],
        // comment: [{ validator: checkComment, trigger: "blur" }]
      },
      // balance:0.00,
    };
  },
  methods: {
    submitForm(formName) {
      if(this.isCreating){
        return
      }
      this.isCreating = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.coin=='bty'?this.currentMain.url:this.coin=='game'?this.currentParallel.url:'';
          console.log("submit!!"+url);
          this.sendToAddr({
            privateKey: this.currentAccount.hexPrivateKey,
            to: this.form.address,
            amount: parseInt(this.form.num * 1e8),
            fee: parseInt(dMinFee * 1e8),
            note: this.form.comment+'',
          },url).then(res => {
            console.log(res)
            this.isCreating = false;
            this.$alert('请关注您的资金变动。', '转账成功', {
              confirmButtonText: '知道了',
              closeOnClickModal:true,
              center:true,
              showClose:false,
            });
            this.replyBackground(res)
          }).catch(err=>{
            this.isCreating = false;
            console.log(err)
            this.$message.error('发生错误');
          })
        } else {
          this.isCreating = false;
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //获取余额
    // getBalance(addr){
    //   this.getAddrBalance(addr, 'coins').then(result => {
    //     console.log(result)
    //     this.balance = result[0].balance / 1e8
    //   })
    // }
  }, 
  computed:{
    ...mapState(['accountMap', 'currentAccount',"mainAsset", "parallelAsset",'currentMain','currentParallel']),
  },
  mounted(){
    if(this.$route.query.coin){
      this.coin = this.$route.query.coin;
      console.log(this.coin)
    }
    this.coin = this.$store.state.Records.assetType;
    this.form.address = this.$route.query.address || '';
    this.refreshMainAsset();
    this.refreshParallelAsset();
    // if (this.currentAccount) {
    //   this.getBalance(this.currentAccount.address)
    // }
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
          &:nth-of-type(2){
            input{
              padding-right: 45px;
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
    height: 66px;
    background-image: url("../../../assets/images/loginBtn.png");
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
