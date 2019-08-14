<template>
  <div class="importWallet_container">
    <asset-back title style="padding-top:0"></asset-back>
    <section class="content">
      <div class="words">
        <p>请输入您12位钱包助记词</p>
        <div class="seed-ui__word-group_zh">
          <one-box-one-word :box-num="15" v-model="seedStringInput"></one-box-one-word>
        </div>
      </div>
      <el-form
        label-position="top"
        :rules="createRules"
        :model="createForm"
        ref="createForm"
        class="password"
      >
        <el-form-item label="请输入您的密码（8-16位字符）" prop="pwd">
          <el-input v-model="createForm.pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="createForm.confirmPwd" type="password"></el-input>
        </el-form-item>
      </el-form>
      <p class="btn">
        <router-link :to="{ name: 'WalletIndex'}">导入</router-link>
      </p>
    </section>
  </div>
</template>

<script>
import AssetBack from "@/components/AssetBack.vue";
import OneBoxOneWord from "@/components/OneBoxOneWord.vue";
export default {
  components: { AssetBack, OneBoxOneWord },
  data() {
    return {
      seedStringInput: "",
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
.importWallet_container {
  .content {
    width: 344px;
    margin: 0 auto;
    margin-top: 24px;
    .words {
      margin-bottom: 22px;
      > p {
        font-size: 16px;
        color: #ffffff;
        margin-bottom: 7px;
      }
      > div {
        height: 150px;
        background: #ffffff;
        padding: 10px 40px 15px 40px;
        border-radius: 10px;
        box-shadow: 2px 2px 5px 3px #ffffff;
      }
      .seed-ui__word-group_zh {
        .word-box {
          height: 36px;
          width: 36px;
          margin-left: 21px;
          font-size: 26px;
          text-align: center;
          &:nth-child(5n + 1) {
            margin-left: 0;
          }
        }
      }
    }
    .password {
      .el-form-item {
        margin-bottom: 15px;
      }
      .el-form-item__label {
        font-size: 16px;
        color: #ffffff;
        padding: 0;
        line-height: 30px;
        &::before{
          content:'';
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
      padding: 12px 0 18px;
      a {
        width: 100%;
        display: inline-block;
        color: rgba(255, 255, 255, 1) !important;
        // margin-top: 6px;
      }
    }
  }
}
</style>
