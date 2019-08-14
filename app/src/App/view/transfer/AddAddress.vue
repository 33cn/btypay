<template>
  <div class="addAddress_container">
    <asset-back title="添加地址"></asset-back>
    <!-- <section class="content">
            <div>
                <p>地址标签</p>
                <input type="text" placeholder="请输入标签内容">
            </div>
            <div>
                <p>地址</p>
                <input class="address" type="text" placeholder="请输入地址">
                <img src="../../../assets/images/scan.png" alt="">
            </div>
    </section>-->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="地址标签" prop="label">
        <el-input v-model="ruleForm.label" placeholder="请输入标签内容" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="ruleForm.address" placeholder="请输入地址" autocomplete="off"></el-input>
        <img src="../../../assets/images/scan.png" alt />
      </el-form-item>
    </el-form>
    <p @click="submitForm('ruleForm')">添加</p>
  </div>
</template>

<script>
import AssetBack from "@/components/AssetBack.vue";
export default {
  components: { AssetBack },
  data() {
    var validateAddress = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("地址不能为空"));
      } 
    };
    var checkLabel = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        return callback(new Error("地址标签不能为空"));
      }
    };
    return {
      ruleForm: {
        label: "",
        address: "",
        comment: ""
      },
      rules: {
        label: [{ validator: checkLabel, trigger: "blur" }],
        address: [{ validator: validateAddress, trigger: "blur" }]
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
    }
  }
};
</script>

<style lang='scss'>
.addAddress_container {
  width: 100%;
  height: 100vh;
  background-image: url("../../../assets/images/lightColorBg.png");
  background-size: 100% 100%;
  > form {
    margin: 51px 50px 0 45px;
    > div {
      margin-bottom: 32px;
      position: relative;
      > label {
        margin-bottom: 15px;
        text-align: left;
        font-size: 18px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(22, 42, 84, 1);
        line-height: 1;
      }
      > div {
        margin-left: 0 !important;
        input {
          width: 100%;
          border: none;
          background-color: transparent;
          border-bottom: 1px solid #a8b1bd;
          font-size: 14px;
          color: rgba(22, 42, 84, 1);
          opacity: 0.8;
          border-radius: 0px;
          height: 30px;
          line-height: 1;
          padding: 0px;
          ::-webkit-input-placeholder {
            /* Chrome/Opera/Safari */
            opacity: 0.5;
          }
        }
        img {
          width: 23px;
          position: absolute;
          right: 12px;
          bottom: 18px;
          cursor: pointer;
        }
      }
      &:nth-of-type(2){
          input{
              padding-right: 40px;
          }
      }
    }
  }
  > p {
    margin: 160px 26px 0 29px;
    padding: 12px 0 18px;
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
