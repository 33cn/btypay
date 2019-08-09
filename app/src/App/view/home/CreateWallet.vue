<template>
  <div class="createWallet_container">
    <home-back></home-back>
    <el-form
      label-position="top"
      :rules="createRules"
      :model="createForm"
      ref="createForm"
      class="content"
    >
      <el-form-item label="请输入您的密码（8-16位字符）" prop="pwd">
        <el-input v-model="createForm.pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input v-model="createForm.confirmPwd" type="password"></el-input>
      </el-form-item>
    </el-form>
    <p class="btn">
      <router-link :to="{ name: 'WordsShow'}">创建</router-link>
    </p>
  </div>
</template>

<script>
import HomeBack from "@/components/HomeBack.vue";
export default {
  components: { HomeBack },
  data() {
    return {
      createForm: {
        pwd: "",
        confirmPwd: ""
      },
      createRules: {
        pwd: [
          { required: true, message: "请输入您的密码", trigger: "blur" },
          { min: 8, max: 16, message: "8 到 16位字符", trigger: "blur" }
        ],
        confirmPwd: [
          { required: true, message: "请输入您的确认密码", trigger: "blur" }
        ]
      }
    };
  }
};
</script>

<style lang='scss'>
.createWallet_container {
  .content {
    width: 350px;
    margin: 0 auto;
    margin-top: 34.5px;
    .el-form-item__label {
      font-size: 18px;
      color: #ffffff;
    }
    input {
      border-radius: 10px;
    }
  }
  .btn {
    margin: 0 auto;
    margin-top: 60px;
    width: 350px;
    height: 43.5px;
    background-image: url("../../../assets/images/longBtnBg.png");
    background-size: 100% 100%;
    text-align: center;
    font-size: 21px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    a {
      width: 100%;
      display: inline-block;
      color: rgba(255, 255, 255, 1) !important;
      margin-top: 3px;
    }
  }
}
</style>
