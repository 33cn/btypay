<template>
  <div class="out_extension_page">
    <div>
      <i v-if="successed=='waiting'" class="el-icon-loading"></i>
      <i v-if="successed=='yes'" class="el-icon-check"></i>
      <i v-if="successed=='no'" class="el-icon-close"></i>
      <p>{{msg}}</p>
      <p>{{checking}}</p>
    </div>
  </div>
</template>
<script>
import { signRawTx, signGroupTx } from "@/libs/sign.js";
import parallelAPI from "@/mixins/parallelAPI.js"
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("Account");
import { getChromeStorage, setChromeStorage } from "@/libs/chromeUtil";
import walletAPI from "@/mixins/walletAPI.js";
export default {
  mixins:[walletAPI,parallelAPI],
    computed: {
      ...mapState(["parallelNode"])
    },
  data() {
    return {
      successed: "waiting",
      msg:'确认中...',
      checking:'',
      name:'',
      win:null
    };
  },
  methods:{
    getCurrentTabId(callback){
    	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    	{
    		if(callback) callback(tabs.length ? tabs[0].id: null);
    	});
    },
    sendMessageToContentScript(message, callback){
	    this.getCurrentTabId((tabId) =>
	    {
	    	chrome.tabs.sendMessage(tabId, message, function(response)
	    	{
	    		if(callback) callback(response);
	    	});
	    });
    },
    btyMainCallback(res){
      let resObj = JSON.parse(res)
      console.log('callback= ')
      console.log(resObj)
      let payload = {}
      this.checking = ''
      // let payload = {hash:res}
      if(resObj.hash){
        this.successed = 'yes'
        this.msg = resObj.hash
        payload = {result:resObj.hash,error:null}
        window.chrome.runtime.sendMessage({
          action:'reply-background-bty-main-parallel',
          payload
        })
        this.win.closeWindow(this.win.windowId);
      }else{
        this.successed = 'no'
        this.checking = ''
        this.msg = resObj.desc + " " + resObj.msg
        payload = {error:resObj.desc + " " + resObj.msg,result:null}
        window.chrome.runtime.sendMessage({
          action:'reply-background-bty-main-parallel',
          payload
        })
        console.log('this.win.windowId='+this.win.windowId)
        // this.win.closeWindow(this.win.windowId);
      }
    },
    btyParallelCallback(res){
      let resObj = JSON.parse(res)
      console.log(res)
      // alert(res)
      // let payload = {hash:res}
      let payload = {}
      this.checking = ''
      if(resObj.hash){
        this.successed = 'yes'
        this.msg = resObj.hash
        payload = {result:resObj.hash,error:null}
        window.chrome.runtime.sendMessage({
          action:'reply-background-bty-parallel-main',
          payload
        })
      }else{
        this.successed = 'no'
        this.checking = ''
        this.msg = resObj.desc + " " + resObj.msg
        payload = {error:resObj.desc + " " + resObj.msg,result:null}
        window.chrome.runtime.sendMessage({
          action:'reply-background-bty-parallel-main',
          payload
        })
      }
      this.win.closeWindow(this.win.windowId);
    },
    ccnyMainCallback(res){
      let resObj = JSON.parse(res)
      console.log(res)
      // let payload = {hash:res}
      let payload = {}
      this.checking = ''
      if(resObj.hash){
        this.successed = 'yes'
        this.msg = resObj.hash
        payload = {result:resObj.hash,error:null}
        window.chrome.runtime.sendMessage({
          action:'reply-background-ccny-main-parallel',
          payload
        })
      }else{
        this.successed = 'no'
        this.checking = ''
        this.msg = resObj.desc + " " + resObj.msg
        payload = {error:resObj.desc + " " + resObj.msg,result:null}
        window.chrome.runtime.sendMessage({
          action:'reply-background-ccny-main-parallel',
          payload
        })
      }
      this.win.closeWindow(this.win.windowId);
    },
    ccnyParallelCallback(res){
      let resObj = JSON.parse(res)
      console.log(res)
      let payload = {}
      // let payload = {hash:res}
      this.checking = ''
      if(resObj.hash){
        this.successed = 'yes'
        this.msg = resObj.hash
        payload = {result:resObj.hash,error:null}
        window.chrome.runtime.sendMessage({
          action:'reply-background-ccny-parallel-main',
          payload
        })
      }else{
        this.successed = 'no'
        this.checking = ''
        this.msg = resObj.desc + " " + resObj.msg
        payload = {error:resObj.desc + " " + resObj.msg,result:null}
        window.chrome.runtime.sendMessage({
          action:'reply-background-ccny-parallel-main',
          payload
        })
      }
      // this.win.closeWindow(this.win.windowId);
    }
  },
  mounted() {
    let payload = {}
    window.chrome.runtime.getBackgroundPage(win => {
    console.log('-=-=-=-=-=-=-=-=-=-=-='+win.txType+'=-=-=-=-=-=')
      this.win = win
      let time = setTimeout(() => {
        if (this.successed != "yes") {
          this.successed = "no";
          setTimeout(() => {
            win.closeWindow(win.windowId);
          }, 800);
        }
      }, 100000);
      if(win.txType == 'sign-tx'){
        // console.log('signRawTx')
        // console.log(win.txObj.tx)
        return Promise.resolve()
        .then(() => {
          return signRawTx(win.txObj.tx, win.currentAccount.hexPrivateKey);
        })
        .then(signedTx => {
          // console.log(win.txObj.tx)
          // console.log(signedTx)
          win.signedTx = signedTx
          let payload = {signedTx}
          window.chrome.runtime.sendMessage({
            action:'reply-background-sign-tx',
            payload,
          })
          this.successed = "yes";
          this.msg = '签名完成。'
          win.closeWindow(win.windowId);
          // return Promise.resolve({signedTx})
          // return this.sendTransaction(signedTx, win.txObj.url);
        })
        // .then(res => {
        //   setTimeout(() => {
        //     this.successed = "yes";
        //     this.msg = '签名完成。'
        //     setTimeout(() => {
        //       win.closeWindow(win.windowId);
        //     }, 500);
        //   }, 100);
        // })
        .catch(err=>{
          console.log(err)
          clearTimeout(time)
          setTimeout(() => {
            this.successed = "no";
            this.msg = err
            setTimeout(() => {
              // win.closeWindow(win.windowId);
            }, 500);
          }, 300);
        });
      }else if(win.txType == 'sign-group-tx'){
        this.getCurrentWallet().then(res=>{
          if(res&&res.parallelNodeList){
            for(let i = 0; i < res.parallelNodeList.length; i++){
              if(res.parallelNodeList[i].url == win.txObj.url){
                this.name = res.parallelNodeList[i].name;
                break
              }
            }
            setTimeout(() => {
              if(this.name == ''){
                setTimeout(() => {
                  this.successed = "no";
                  this.msg = '请在钱包中添加节点。'
                }, 3000);
                return
              }else{
                this.msg = '交易组签名中...'
                return Promise.resolve().then(()=>{
                  // console.log('钱包私钥：'+win.currentAccount.hexPrivateKey)
                  if(win.currentAccount.hexPrivateKey){
                    return signGroupTx(win.txObj.tx, win.currentAccount.hexPrivateKey);
                  }else{
                    payload = {result:null,error:'ErrNoHexPrivateKey'}
                    window.chrome.runtime.sendMessage({
                      action:'reply-background-sign-group-tx',
                      payload,
                    })
                    return
                  }
                }).then(signedTx=>{
                  this.msg = '交易组签名完成。'
                  console.log('signGroupTx==')
                  console.log(signedTx)
                  console.log(win.txObj.url)
                  if(!win.txObj.isSend){
                    payload = {result:signedTx,error:null}
                    window.chrome.runtime.sendMessage({
                      action:'reply-background-sign-group-tx',
                      payload,
                    })
                    win.closeWindow(win.windowId);
                    return
                  }else{
                    return this.sendTransaction(signedTx, win.txObj.url).then(res=>{
                      console.log('交易组签名完成。')
                      console.log(res)
                      setTimeout(() => {
                        this.successed = "yes";
                        this.msg = '交易组签名完成。'
                        this.checking = '交易检测中...'
                        this.txStateCheckTask(res,win.txObj.url,error=>{
                          console.log('===error===')
                          console.log(error)
                          this.checking = ''
                          if (error) {
                            this.checking = error
                            payload = {error,result:res}
                            window.chrome.runtime.sendMessage({
                              action:'reply-background-sign-group-tx',
                              payload,
                            })
                            // return
                          }else{
                            if(res.substr(0,2) == '0x'){
                              payload = {result:res,error:null}
                              window.chrome.runtime.sendMessage({
                                action:'reply-background-sign-group-tx',
                                payload,
                              })
                              win.closeWindow(win.windowId);
                            }
                          }
                        })
                      }, 0);
                    })
                  }
                }).catch(err=>{
                  console.log('捕获异常')
                  console.log(err)
                  this.successed = "no";
                  this.msg = err
                })
              }
            })
          }
        })
      }else if(win.txType == 'send-tx'){
        console.log('win.txObj.tx')
        console.log(win.txObj.tx)
        console.log(win.currentAccount.hexPrivateKey)
        console.log(win.txObj.url)
        return Promise.resolve()
        .then(() => {
          return signRawTx(win.txObj.tx, win.currentAccount.hexPrivateKey);
        })
        .then(signedTx => {
          console.log('signRawTx')
          console.log(signedTx)
          return this.sendTransaction(signedTx, win.txObj.url);
          // win.signedTx = signedTx
          // let payload = {signedTx}
          // window.chrome.runtime.sendMessage({
          //   action:'reply-background-sign-tx',
          //   payload,
          // })
        }).then(res=>{
          console.log('sendTransaction')
          console.log(res)
          let payload = {hash:res}
          window.chrome.runtime.sendMessage({
            action:'reply-background-send-tx',
            payload,
          })
          setTimeout(() => {
            this.successed = "yes";
            this.msg = '签名完成。'
            setTimeout(() => {
              // win.closeWindow(win.windowId);
            }, 500);
          }, 100);
        })
        .catch(err=>{
          console.log(err)
          clearTimeout(time)
          setTimeout(() => {
            this.successed = "no";
            this.msg = err
            setTimeout(() => {
              // win.closeWindow(win.windowId);
            }, 500);
          }, 300);
        });
      }else if(win.txType == 'create-tx'){
        return Promise.resolve().then(()=>{
          return this.createRawTransaction(win.txObj.params, win.txObj.url)
        }).then(tx=>{
          console.log('createRawTransaction')
          console.log(tx)
          return signRawTx(tx, win.currentAccount.hexPrivateKey);
        }).then(signedTx=>{
          console.log('signRawTx')
          console.log(signedTx)
          return this.sendTransaction(signedTx, win.txObj.url);
        }).then(res=>{
          console.log('构造完成')
          console.log(res)
          setTimeout(() => {
            this.successed = "yes";
            this.msg = '构造完成。'
            let payload = {hash:res}
            window.chrome.runtime.sendMessage({
              action:'reply-background-create-tx',
              payload,
            })
            setTimeout(() => {
              // win.closeWindow(win.windowId);
            }, 500);
          }, 0);
        }).catch(err=>{
          console.log(err)
          this.successed = "no";
            this.msg = err
        })
      }else if(win.txType == 'para-coins-dice'){
        this.getCurrentWallet().then(res => {
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
                  this.msg = '请在钱包中添加游戏节点。'
                }, 3000);
                return
              }else{
                this.parallelCoins2Dice(win.txObj.amount*1e8,win.txObj.url,this.name).then(res=>{
                  let txs = [res,win.txObj.tx]
                  console.log(txs)
                  return this.createRawTxGroup(txs,win.txObj.url)
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
                    this.msg = '投注成功。'
                    win.voteHash = res
                    let payload = {voteHash:win.voteHash}
                    window.chrome.runtime.sendMessage({
                      action:'reply-background-para-coins-dice',
                      payload
                    })
                    // this.sendMessageToContentScript('你好，我是popup！', (response) => {
	                  // 	if(response) alert('收到来自content-script的回复：'+response);
	                  // });
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
                    // this.msg = '您的燃料BTY不够，请充值。'
                    this.msg = err
                    setTimeout(() => {
                      // win.closeWindow(win.windowId);
                    }, 500);
                  }, 300);
                })
              }
            }, 300);
          }
        });
        // 借贷跨链
      }else if(win.txType == 'bty-main-parallel' || win.txType == 'bty-parallel-main'||win.txType == 'ccny-main-parallel' || win.txType == 'ccny-parallel-main'){
        this.getCurrentWallet().then(res=>{
          console.log(res)
          if (res.parallelNodeList) {
            for(let i = 0; i < res.parallelNodeList.length; i++){
              if(res.parallelNodeList[i].url == win.txObj.url){
                this.name = res.parallelNodeList[i].name;
                break
              }
            }
            setTimeout(() => {
              if(this.name == ''){
                setTimeout(() => {
                  this.successed = "no";
                  this.msg = '请在钱包中添加游戏节点。'
                }, 3000);
                return
              }else{
                this.msg = '数字资产跨链兑换中...'
                if(win.txType == 'bty-main-parallel'){
                  this.btyMain2parallel(win.currentAccount.hexPrivateKey,parseInt(win.txObj.amount*1e8),this.btyMainCallback)
                }else if(win.txType == 'bty-parallel-main'){
                  this.btyParallel2Main(win.currentAccount.hexPrivateKey,parseInt(win.txObj.amount*1e8),this.btyParallelCallback)
                }else if(win.txType == 'ccny-main-parallel'){
                  this.ccnyMain2parallel(win.currentAccount.hexPrivateKey,parseInt(win.txObj.amount*1e8),this.ccnyMainCallback)
                }else if(win.txType == 'ccny-parallel-main'){
                  this.ccnyParallel2Main(win.currentAccount.hexPrivateKey,parseInt(win.txObj.amount*1e8),this.ccnyParallelCallback)
                }
              }
            })
          }
        })
      }
    });
  }
};
</script>
<style lang='scss'>
html,body,#app{
  width: 100vw;
  height: 100vh;
}
.out_extension_page {
  width:100%;
  height:100%;
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
    >p{
      width: 100%;
      padding: 0 10px;
      text-align: center;
      word-wrap:break-word;
      word-break:break-all;
      &:nth-of-type(2){
        margin-top: 15px;
      }
    }
  }
}
</style>