<template>
  <div class="login_container">
    <!-- <home-header></home-header> -->
    <div class="desc">
      <img src="../../../assets/images/loginLogo.png" alt />
      <p>欢迎回来</p>
    </div>
    <el-form label-position="top" :rules="rules" :model="form" ref="loginForm" class="password">
      <el-form-item label prop="pwd">
        <el-input ref="pwdInput" v-model="form.pwd" type="password" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div class="btn">
      <p @click="loginHandle">登录{{isLogining?'...':''}}</p>
    </div>
    <footer>
      <p>
        <router-link :to="{ name: 'CreateWallet'}">创建</router-link>
      </p>
      <p>
        <router-link :to="{ name: 'ImportWallet'}">导入</router-link>
      </p>
    </footer>
  </div>
</template>
<script>
// import HomeHeader from "@/components/HomeHeader.vue";
import walletAPI from "@/mixins/walletAPI.js";
import { getChromeStorage } from "@/libs/chromeUtil.js";
import { decrypt } from "@/libs/crypto.js";
export default {
  //   components: { HomeHeader },
  mixins: [walletAPI],
  data() {
    return {
      cipherMnemonic: "",
      isLogining:false,
      form: {
        pwd: ""
      },
      rules: {
        pwd: [
          { required: true, message: "请输入您的密码", trigger: "blur" },
          { min: 8, max: 16, message: "8 到 16位字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    loginHandle() {
      this.$refs['loginForm'].validate(valid=>{
        if(valid){
          this.isLogining = true;
          const mnemonic = decrypt(this.cipherMnemonic, this.form.pwd);
          // console.log(mnemonic);
          // console.log(mnemonic.split(" "));
          if (mnemonic.split(" ").length !== 15) {
            this.$message.error("密码错误");
            this.isLogining = false;
            return;
          }
          this.createHDWallet(mnemonic);
          this.recoverAccount();
          this.$message.success("登录成功");
          setTimeout(() => {
            this.$router.push("/WalletIndex");
          }, 500);
        }
      })
    }
  },
  mounted() {
    this.$refs["pwdInput"] && this.$refs["pwdInput"].focus();
    this.getWallet().then(wallet => {
      if (wallet) {
        // 已创建/导入钱包
        getChromeStorage("loginTime").then(res => {
          if (res.loginTime) {
            let time = 1 * 24 * 60 * 60 * 1000;
            if (new Date().valueOf() - parseInt(res.loginTime) >= time) {
              console.log("大于24小时");
              //   this.$router.push({ name: "login" });
            } else {
              this.$router.push("/WalletIndex");
            }
          }
        });
      } else {
        getChromeStorage("ciphertext").then(result => {
          console.log("result");
          console.log(result);
          if (result.ciphertext) {
            this.cipherMnemonic = result.ciphertext;
          } else {
            this.$router.push("/ImportOrCreate");
          }
        });
      }
      this.recoverAccount();
    });
  }
};
</script>
<style lang='scss'>
.login_container {
  > div.desc {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 107px 0 71px;
    p {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 30px;
      margin: 31px 0 0px;
      color: rgba(255, 255, 255, 1);
      // &:nth-of-type(1) {
      //   font-size: 18px;
      //   margin: 15px 0 33px;
      // }
      // &:nth-of-type(2) {
      //   font-size: 30px;
      // }
    }
    img {
      width: 115px;
      height: 126px;
    }
  }
  > form {
    margin: 0 61px;
    > div {
      margin-bottom: 30px;
      div.el-input {
        input.el-input__inner {
          background-color: transparent !important;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.68);
          border-radius: 0px;
          color: #fff;
          // padding: 10px 0 0 0;
        }
        input:-webkit-autofill , textarea:-webkit-autofill, select:-webkit-autofill {
	        -webkit-text-fill-color: #ededed !important;
	        -webkit-box-shadow: 0 0 0px 1000px transparent  inset !important;
          background-color:transparent;
          background-image: none;
          transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
        }
      }
    }
  }
  div.btn {
    height: 66px;
    margin: 0 56px 54px;
    background-image: url("../../../assets/images/loginBtn.png");
    background-size: 100% 100%;
    p {
      height: 44px;
      line-height: 42px;
      text-align: center;
      font-size: 16px;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
    }
  }
  footer {
    margin: 0px 66px;
    display: flex;
    justify-content: flex-start;
    p {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      &:nth-of-type(1) {
        margin-right: 29px;
      }
      a {
        font-family: MicrosoftYaHei;
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
      }
    }
  }
}
</style>