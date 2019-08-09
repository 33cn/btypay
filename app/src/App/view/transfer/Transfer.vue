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
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <el-form-item label="转账金额" prop="num">
        <el-input type='number' v-model="ruleForm.num" placeholder='请输入金额' autocomplete="off" ></el-input>
        <p class="balance">余额0.00BTY</p>
        <p class="mentionAll">全部提取</p>
      </el-form-item>
      <el-form-item label="收款地址" prop="address">
        <el-input v-model="ruleForm.address" placeholder='请输入BTY地址' autocomplete="off"></el-input>
        <img src="../../../assets/images/scan.png" alt="" class="scan">
        <p class="line"></p>
        <img src="../../../assets/images/add.png" alt="" @click="$router.push({name:'address'})" class="add">
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input v-model.number="ruleForm.comment" placeholder='选填'></el-input>
        <div class="fee">
            <p>矿工费</p>
            <p>0.001BTY</p>
        </div>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item> -->
    </el-form>
    <p @click="submitForm('ruleForm')">创建</p>
  </div>
</template>

<script>
import AssetBack from "@/components/AssetBack.vue";
export default {
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
      ruleForm: {
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
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
      margin: 70px 20.5px 0;
      >div{
          margin-bottom: 46px;
          position: relative;
          >label{
                margin-bottom: 13px;
                text-align: left;
                font-size:18px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(22,42,84,1);
                line-height:1;
          }
          >div{
              margin-left: 0!important;
              input{
                  padding: 25px 100px 25px 15px;
                  border: 1px solid transparent;
                  font-size:20px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    // color:rgba(206,213,232,1);
                    line-height:1;
                  ::-webkit-input-placeholder { /* Chrome/Opera/Safari */ 
		        	color:rgba(206,213,232,1);
		        }
              }
              p{
                  font-size:18px;
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
                    font-size: 20px;
                    color:rgba(255,120,91,1);
                    top: 46px;
                    right: 8.5px;
                }
              }
              p.line{
                  width: 1px;
                  height: 25px;
                  position: absolute;
                  top: 44px;
                  right: 44px;
                  background-color: rgba(230,230,230,1);
              }
              img{
                  position: absolute;
                  width: 23px;
                  top: 45px;
                  right: 54px;
                  &.add{
                      right: 11px;
                  }
              }
              div.fee{
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-top: 8.5px;
                  p{
                      position: static;
                      font-size:18px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    color:rgba(22,42,84,0.63);
                    line-height:1;
                    &:nth-of-type(2){
                        margin-right: 8px;
                    }
                  }
              }
          }
          &:nth-of-type(3){
              input{
                  padding: 25px 15px!important;
              }
          }
      }
  }
  section.content {
    margin: 70px 20.5px 0;
    > div {
      margin-bottom: 23.5px;
      position: relative;
      p {
        font-size: 18px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(22, 42, 84, 1);
        line-height: 1;
        &.name {
          margin-bottom: 13px;
        }
        &.balance {
          opacity: 0.53;
          position: absolute;
          top: 0px;
          right: 0px;
        }
      }
      input {
        width: 100%;
      }
    }
  }
  > p {
    margin: 55px 23px 0;
    padding: 9px 0 14px;
    background-image: url("../../../assets/images/addAddressBtn.png");
    background-size: 100% 100%;
    text-align: center;
      font-size: 20px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 1;
  }
}
</style>
