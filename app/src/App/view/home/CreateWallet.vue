<template>
  <div class="createWallet_container">
    <asset-back title style="padding-top:0"></asset-back>
    <el-form
      label-position="top"
      :rules="createRules"
      :model="createForm"
      ref="createForm"
      class="content"
    >
      <el-form-item label="请输入您的密码（8-16位字符）" prop="pwd" >
        <el-input v-model="createForm.pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input v-model="createForm.confirmPwd" type="password"></el-input>
      </el-form-item>
    </el-form>
    <div class="btn">
      <div @click="handleCreate" :to="{ name: 'WordsShow'}">创建</div>
    </div>
  </div>
</template>

<script>
import AssetBack from "@/components/AssetBack.vue";
export default {
  components: { AssetBack },
  data() {
    var confirmPwdValidate = (rule, value, callback) => {
      if (value !== this.createForm.pwd) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
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
          { required: true, message: "请输入您的确认密码", trigger: "blur" },
          { validator: confirmPwdValidate, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleCreate() {
      // this.$refs.createForm.validate(valid => {
      //   if (valid) {
          this.$store.commit("Account/UPDATE_PASSWORD", this.createForm.pwd);
          this.$router.push({ name: "WordsShow" });
      //   }
      // });
    }
  }
};
</script>

<style lang='scss'>
.createWallet_container {
  .content {
    width: 344px;
    margin: 0 auto;
    margin-top: 27.6px;
    .el-form-item {
      margin-bottom: 15px;
    }
    .el-form-item__label {
      font-size: 16px;
      color: #ffffff;
      padding: 0;
      line-height: 30px;
      &::before{
       content:''!important;
      }
    }
    input {
      border-radius: 10px;
      height: 38px;
    }
  }

  .btn {
    margin: 0 auto;
    margin-top: 36px;
    width: 344px;
    height: 47px;
    background-image: url("../../../assets/images/longBtnBg.png");
    background-size: 100% 100%;
    text-align: center;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    padding-top: 5px;
    > div {
      &:hover {
        cursor: pointer;
      }
      width: 100%;
      display: inline-block;
      color: rgba(255, 255, 255, 1) !important;
      margin-top: 3px;
    }
  }
}
</style>
