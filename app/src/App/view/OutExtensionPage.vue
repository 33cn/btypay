<template>
  <div class="out_extension_page">
    <div v-if="successed=='waiting'">
      <i class="el-icon-loading"></i>
      <p>确认中...</p>
    </div>
    <div v-if="successed=='yes'">
      <i class="el-icon-check"></i>
      <p>{{successMsg}}</p>
    </div>
    <div v-if="successed=='no'">
      <i class="el-icon-close"></i>
      <p>{{errMsg}}</p>
    </div>
    <!-- <div>{{name}}</div> -->
  </div>
</template>
<script>
import { signRawTx, signGroupTx } from "@/libs/sign.js";
import parallelAPI from "@/mixins/parallelAPI.js"
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("Account");
import { getChromeStorage, setChromeStorage } from "@/libs/chromeUtil";
export default {
  mixins:[parallelAPI],
    computed: {
      ...mapState(["parallelNode"])
    },
  data() {
    return {
      successed: "waiting",
      errMsg:'投注失败,请稍后重试。',
      successMsg:'投注成功。',
      name:''
    };
  },
  mounted() {
    window.chrome.runtime.getBackgroundPage(win => {
      let time = setTimeout(() => {
        if (this.successed != "yes") {
          this.successed = "no";
          setTimeout(() => {
            win.closeWindow(win.windowId);
          }, 800);
        }
      }, 10000);
      if(win.txType == 'sign-tx'){
        return Promise.resolve()
        .then(() => {
          return signRawTx(win.txObj.tx, win.currentAccount.hexPrivateKey);
        })
        .then(signedTx => {
          return this.sendTransaction(signedTx, win.txObj.url);
        })
        .then(res => {
          setTimeout(() => {
            this.successed = "yes";
            this.successMsg = '签名完成。'
            setTimeout(() => {
              win.closeWindow(win.windowId);
            }, 500);
          }, 100);
        }).catch(err=>{
          console.log(err)
          clearTimeout(time)
          setTimeout(() => {
            this.successed = "no";
            this.errMsg = err
            setTimeout(() => {
              // win.closeWindow(win.windowId);
            }, 500);
          }, 300);
        });
      }else if(win.txType == 'para-coins-dice'){
        getChromeStorage("parallelNodeList").then(res => {
          console.log(res)
          console.log(win.txObj.url)
          if (res.parallelNodeList) {
            // this.paraNodeList = res.parallelNodeList;
            // this.$store.commit("Account/UPDATE_PARALLEL_NODE", res.parallelNodeList);
            for(let i = 0; i < res.parallelNodeList.length; i++){
              if(res.parallelNodeList[i].url == win.txObj.url){
                this.name = res.parallelNodeList[i].name;
                break
              }
              // if(i == res.parallelNodeList.length-1&&this.name == ''){}
            }
            setTimeout(() => {
              if(this.name == ''){
                setTimeout(() => {
                  this.successed = "no";
                  this.errMsg = '请在钱包中添加游戏节点。'
                }, 3000);
                return
              }else{
                this.parallelCoins2Dice(win.txObj.amount*1e8,win.txObj.url,this.name).then(res=>{
                  console.log('outExtension')
                  console.log(res)
                  console.log("xxxxxx", win.txObj.tx)
                  let txs = [res,win.txObj.tx]
                  return this.createRawTxGroup(txs)
                }).then(tx => {
                  console.log('createRawTxGroup')
                  console.log(tx)
                  return signGroupTx(tx, win.currentAccount.hexPrivateKey)
                }).then(signedTx => {
                  console.log('signGroupTx')
                  console.log(signedTx)
                  return this.sendTransaction(signedTx, win.txObj.url)
                }).then(res=>{
                  console.log('sendTransaction')
                  console.log(res)
                  // this.txStateCheckTask(res,win.txObj.url,(res)=>{
                  //   console.log('callback')
                  //   console.log(res)
                  // })
                  setTimeout(() => {
                    this.successed = "yes";
                    setTimeout(() => {
                      // win.closeWindow(win.windowId);
                    }, 500);
                  }, 300);
                }).catch(err=>{
                  console.log('发生错误了')
                  console.log(err)
                  clearTimeout(time)
                  setTimeout(() => {
                    this.successed = "no";
                    // this.errMsg = '您的燃料BTY不够，请充值。'
                    this.errMsg = err
                    setTimeout(() => {
                      // win.closeWindow(win.windowId);
                    }, 500);
                  }, 300);
                })
              }
            }, 300);
          }
        });
      }
      
      
      
      
    });
  }
};
</script>
<style lang='scss'>
.out_extension_page {
  > div {
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 20px;
    position: absolute;
    top: 200px;
    i {
      margin-bottom: 10px;
      font-size: 40px;
    }
  }
}
</style>