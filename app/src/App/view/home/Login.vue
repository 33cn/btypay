<template>
  <div class="login_container">
    <!-- <home-header></home-header> -->
    <div class="desc">
      <img src="../../../assets/images/loginLogo.png" alt />
      <p>欢迎回来</p>
    </div>
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link" @click="isRotate=!isRotate">
        {{$store.state.Account.currentAccount.name || wallet.name || '请选择钱包'}}<i :class="isRotate?'el-icon-arrow-down el-icon--right rotate':'el-icon-arrow-down el-icon--right'"></i>
      </span>
      <el-dropdown-menu slot="dropdown" class="loginPage">
        <el-dropdown-item v-for="(item,i) in accountList" :key="i" 
          :command="item" :class="mouseEnterIndex==i?'mouseEnter':''">{{item.name}}</el-dropdown-item>
        <!-- <el-dropdown-item command="b">钱包二</el-dropdown-item>
        <el-dropdown-item command="c">钱包三</el-dropdown-item> -->
      </el-dropdown-menu>
    </el-dropdown>
    <el-form label-position="top" :rules="rules" :model="form" ref="loginForm" class="password">
      <el-form-item label prop="pwd">
        <el-input ref="pwdInput" v-model="form.pwd" type="password" placeholder="请输入您的密码" autocomplete="off"></el-input>
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
      <!-- <p @click="test" style="margin-left:50px">测试</p> -->
    </footer>
  </div>
</template>
<script>
// import HomeHeader from "@/components/HomeHeader.vue";
import walletAPI from "@/mixins/walletAPI.js";
import { getChromeStorage,setChromeStorage } from "@/libs/chromeUtil.js";
import { decrypt } from "@/libs/crypto.js";
// import {createNoneTx} from '@/libs/sign.js'
// import parallelAPI from "@/mixins/parallelAPI.js";
// import { createNamespacedHelpers } from "vuex";
// const { mapState } = createNamespacedHelpers("Account");
export default {
  //   components: { HomeHeader },
  mixins: [walletAPI],
  data() {
    return {
      accountList:[
        // {name:'钱包一'},{name:'钱包二'},{name:'钱包三'},{name:'钱包四'},{name:'钱包五'}
      ],
      wallet:{},
      // winWallet:{},
      mouseEnterIndex:null,
      // walletName:'',
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
      },
      isRotate:false
    };
  },
  computed:{
    pageIsClose(){
      return this.$store.state.Records.pageIsClose
    },
  },
  methods: {
    loginHandle() {
      if(this.wallet.name&&this.wallet.ciphertext){
        this.$refs['loginForm'].validate(valid=>{
          if(valid){
            this.isLogining = true;
            let mnemonic = decrypt(this.wallet.ciphertext, this.form.pwd);
            console.log(mnemonic);
            console.log(this.wallet)
            // console.log(mnemonic.split(" "));
            if (mnemonic.split(" ").length !== 15) {
              this.$message.error("输入的密码有误。");
              this.isLogining = false;
              return;
            }
            let myWallet = this.createHDWallet(mnemonic);//创建钱包并赋值给window
            this.recoverAccount(this.wallet.name).then(res=>{
              if(res == 'success'){
                setChromeStorage("CurrentAccountName", this.wallet.name).then(res=>{
                  console.log('=====钱包名称存储成功=====')
                  this.isLogining = false;
                  this.$message.success("登录成功");
                  setChromeStorage('extensionStatus','').then(res=>{})
                  this.$store.commit("Account/UPDATE_PASSWORD", this.form.pwd);
                  this.$router.push("/WalletIndex");
                })
              }
            }).catch(err=>{
              this.isLogining = false;
            })
          }
        })
      }else{
        this.$message.warning("请选择您要登录的钱包");
        console.log(this.wallet.name)
        console.log(this.wallet.ciphertext)
      }
    },
    handleCommand(val){
      console.log(val)
      this.wallet = val
      this.$store.commit('Account/UPDATE_CURRENTACCOUNT', val)
    },
    getElements(path){
      getChromeStorage('element').then(ele=>{
        if(path = '/node'){

        }
      })
    },
    clearPath(){
      // setChromeStorage('element',{}).then(res=>{
      //     console.log(res)
      // })
      setChromeStorage('beforePath',{}).then(res=>{
          console.log(res)
      })
    },
    getWinCurrentAccount(){
      this.getBackgroundPage().then(win=>{
        // this.winWallet = win.currentAccount
        for(let i = 0; i < this.accountList.length; i++){
          if(this.accountList[i].name == win.currentAccount.name){
            this.wallet = this.accountList[i]
            break
          }
        }
      })
    },
    update_store(){
      this.getCurrentWalletName().then(name=>{
        let wallets = this.accountList
        for(let i = 0; i < wallets.length; i++){
          if(wallets[i].name == name){
            this.wallet = wallets[i]
            let account = {}
            account.address = wallets[i].address
            account.hexPrivateKey = wallets[i].hexPrivateKey
            account.name = wallets[i].name
            account.pasword = wallets[i].password
            account.ciphertext = wallets[i].ciphertext
            this.$store.commit('Account/UPDATE_MAIN_NODE', wallets[i].mainNodeList)
            this.$store.commit('Account/UPDATE_PARALLEL_NODE', wallets[i].parallelNodeList)
            this.$store.commit('Account/UPDATE_CURRENT_MAIN', wallets[i].currentMainNode)
            this.$store.commit('Account/UPDATE_CURRENT_PARALLEL', wallets[i].currentParaNode)
            this.$store.commit('Account/UPDATE_CURRENTACCOUNT', account)
          }
        }
      })
    }
  },
  mounted() {
    this.getAccountList().then(res=>{
      if(res.length == 0){
        setChromeStorage('loginTime', (new Date()).valueOf()).then(res => {
          console.log('保存钱包打开时间')
        })
        this.$router.push("/ImportOrCreate");
        return
      }
      this.accountList = res
      // this.getWinCurrentAccount()
      this.getWallet().then(wallet=>{
        console.log('11_+_+_+_+_+_+_+_+_+_+_+_+_')
        console.log(wallet)
        console.log('11_+_+_+_+_+_+_+_+_+_+_+_+_')
        if(wallet){
          this.update_store()
          // 已创建/导入钱包(钱包锁定)
          getChromeStorage("loginTime").then(res=>{
            console.log(res.loginTime)
            if (res.loginTime) {
              let limitTime = 1 * 24 * 60 * 60 * 1000;
              console.log(new Date().valueOf() - parseInt(res.loginTime) - limitTime)
              if (new Date().valueOf() - parseInt(res.loginTime) >= limitTime) {
                console.log("大于24小时");
                setChromeStorage('loginTime', (new Date()).valueOf()).then(res => {
                  console.log('保存钱包打开时间')
                })
                return
              }else{
                getChromeStorage('beforePath').then(res=>{
                  console.log('res.beforePath.path')
                  console.log(res)
                  setChromeStorage('loginTime', (new Date()).valueOf()).then(res => {
                    console.log('保存钱包打开时间')
                  })
                  if(res.beforePath&&res.beforePath.path){
                    if(res.beforePath.path == '/ImportWallet' || res.beforePath.path == '/CreateWallet'){
                      console.log('进来了1'+this.pageIsClose)
                      if(this.pageIsClose){
                        let path = res.beforePath.path;
                        this.clearPath();
                        this.$router.push(path);
                      }else{
                        this.clearPath();
                      }
                      return
                    }
                    let queryArr = Object.keys(res.beforePath.query)
                    if(queryArr.length>0){
                      this.$router.push(res.beforePath.path+'?'+queryArr[0]+'='+res.beforePath.query[queryArr[0]]);
                      return
                    }else if(Object.keys(res.beforePath.params).length>0){
                    }else{
                      this.$router.push(res.beforePath.path);
                    }
                  }else{
                    // this.$router.push("/WalletIndex");
                  }
                })
              }
            }else{
              setChromeStorage('loginTime', (new Date()).valueOf()).then(res => {
                console.log('保存钱包打开时间')
              })
            }
          })
        }else{
          // 钱包登出、无钱包
          setChromeStorage('loginTime', (new Date()).valueOf()).then(res => {
            console.log('保存钱包打开时间')
          })
          this.$router.push("/ImportOrCreate");
        }
      })
    }).catch(err=>{
      this.$router.push("/ImportOrCreate");
      // console.log(err)
    })
    // this.$refs["pwdInput"] && this.$refs["pwdInput"].focus();
  }
  // mounted() {
  //   this.$refs["pwdInput"] && this.$refs["pwdInput"].focus();
  //   this.getWallet().then(wallet => {
  //     // console.log('_+_+_+_+_+_+_+_+_+_+_+_+_')
  //     // console.log(wallet)
  //     // console.log('_+_+_+_+_+_+_+_+_+_+_+_+_')
  //     if (wallet) {
  //       // 已创建/导入钱包(钱包锁定)
  //       console.log('have wallet')
  //       getChromeStorage("loginTime").then(res => {
  //         if (res.loginTime) {
  //           let time = 1 * 24 * 60 * 60 * 1000;
  //           if (new Date().valueOf() - parseInt(res.loginTime) >= time) {
  //             console.log("大于24小时");
  //             getChromeStorage("ciphertext").then(result =>{
  //               if (result&&result.ciphertext) {
  //                 this.cipherMnemonic = result.ciphertext;
  //               }
  //             })
  //           } else {
  //             // this.$router.push("/WalletIndex");
  //             getChromeStorage('beforePath').then(res=>{
  //               console.log('res.beforePath.path')
  //               console.log(res)
  //               if(res.beforePath&&res.beforePath.path){
  //                 if(res.beforePath.path == '/ImportWallet' || res.beforePath.path == '/CreateWallet'){
  //                   console.log('进来了1'+this.pageIsClose)
  //                   if(this.pageIsClose){
  //                     let path = res.beforePath.path;
  //                     this.clearPath();
  //                     this.$router.push(path);
  //                   }else{
  //                     this.clearPath();
  //                   }
  //                   return
  //                 }
  //                 let queryArr = Object.keys(res.beforePath.query)
  //                 if(queryArr.length>0){
  //                   this.$router.push(res.beforePath.path+'?'+queryArr[0]+'='+res.beforePath.query[queryArr[0]]);
  //                   return
  //                 }else if(Object.keys(res.beforePath.params).length>0){

  //                 }else{
  //                   this.$router.push(res.beforePath.path);
  //                 }
  //               }else{
  //                 this.$router.push("/WalletIndex");
  //               }
  //               // this.getElements(res.beforePath.path)
  //             })

  //           }
  //         }
  //       });
  //     } else {
  //       console.log('no wallet')
  //       getChromeStorage("ciphertext").then(result => {
  //         console.log("result");
  //         console.log(result);
  //         if (result&&result.ciphertext) {
  //           this.cipherMnemonic = result.ciphertext;
  //           getChromeStorage('beforePath').then(res=>{
  //             console.log('--beforePath---')
  //             console.log(res)
  //             if(res.beforePath&&res.beforePath.path){
  //               if(res.beforePath.path == '/ImportWallet' || res.beforePath.path == '/CreateWallet'){
  //                   console.log('进来了2'+this.pageIsClose)
  //                   if(this.pageIsClose){
  //                     let path = res.beforePath.path;
  //                     this.clearPath();
  //                     this.$router.push(path);
  //                   }else{
  //                     this.clearPath();
  //                   }
  //                   return
  //                 }
  //               let queryArr = Object.keys(res.beforePath.query)
  //               if(queryArr.length>0){
  //                 this.$router.push(res.beforePath.path+'?'+queryArr[0]+'='+res.beforePath.query[queryArr[0]]);
  //                 return
  //               }else if(Object.keys(res.beforePath.params).length>0){
  //               }else{
  //                 this.$router.push(res.beforePath.path);
  //               }
  //             }else{
  //               // console.log('跳转了')
  //               // this.$router.push("/ImportOrCreate");
  //             }
  //           })
  //         } else {
  //           // this.$router.push("/ImportOrCreate");
  //           getChromeStorage('beforePath').then(res=>{
  //             console.log('--beforePath')
  //             console.log(res)
  //             if(res.beforePath&&res.beforePath.path){
  //               if(res.beforePath.path == '/ImportWallet' || res.beforePath.path == '/CreateWallet'){
  //                   console.log('进来了3'+this.pageIsClose)
  //                   if(this.pageIsClose){
  //                     let path = res.beforePath.path;
  //                     this.clearPath();
  //                     this.$router.push(path);
  //                   }else{
  //                     this.clearPath();
  //                   }
  //                   return
  //                 }
  //               let queryArr = Object.keys(res.beforePath.query)
  //               if(queryArr.length>0){
  //                 this.$router.push(res.beforePath.path+'?'+queryArr[0]+'='+res.beforePath.query[queryArr[0]]);
  //                 return
  //               }else if(Object.keys(res.beforePath.params).length>0){
  //               }else{
  //                 this.$router.push(res.beforePath.path);
  //               }
  //             }else{
  //               // console.log('跳转了')
  //               this.$router.push("/ImportOrCreate");
  //             }
  //           })
  //         }
  //       });
  //     }
  //     this.recoverAccount();
  //   }).catch(err=>{
  //     // console.log(wallet)
  //   });
  // }
};
</script>
<style lang='scss'>
.login_container {
  > div.desc {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 107px 0 57px;
    p {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 30px;
      margin: 19px 0 0px;
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
      width: 105px;
      height: 121px;
    }
  }
  >div.el-dropdown{
    margin: 0 0 18px 65px;
    cursor: pointer;
    >span{
      font-size:16px;
      font-family:Microsoft YaHei;
      color:rgba(255,255,255,1);
      i{
        color: rgba(158,185,239,1);
        font-weight: bold;
        transition: transform 0.2s linear;
        &.rotate{
          transform: rotate(180deg);
        }
      }
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
          padding: 0 4px;
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
    margin: 0 56px 26px;
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