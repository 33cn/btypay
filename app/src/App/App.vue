<template>
  <div id="app">
    <!-- <my-header></my-header> -->
    <router-view/>
  </div>
</template>
<script>
// import MyHeader from './Header'
import {eventBus} from '@/libs/eventBus'
import {getChromeStorage,setChromeStorage} from '@/libs/chromeUtil.js'
export default {
  // components: {MyHeader},
  mounted() {
    eventBus.$on('node-change', (val) => {
      this.$chain33Sdk.httpProvider.setUrl(val) 
      // eventBus.$emit('provider-changed')
    })
    getChromeStorage('mainNodeList').then(res=>{
      if(res.mainNodeList && res.mainNodeList.length > 0){
        // this.$store.commit('Account/UPDATE_CURRENT_MAIN', res.mainNode)
        // chrome.storage.local.set({ 'mainNodeList': [{index: 0,url:'http://47.107.15.126:8801',txHeight: -1, txIndex: 0, name: "BTY" }] }, () => {})
      }else{
        chrome.storage.local.set({ 'mainNodeList': [{index: 0,url:'http://47.107.15.126:8801',txHeight: -1, txIndex: 0, name: "BTY" }] }, () => {})
        // console.log(this.$store.state.Account.mainNode)
      }
    })
    getChromeStorage('parallelNodeList').then(res=>{
      if(res.parallelNodeList && res.parallelNodeList.length > 0){
        // chrome.storage.local.set({ 'parallelNodeList': [{index: 0,name:'gbttest',coin:"GBT",url:"http://114.55.11.139:1198",txHeight: -1, txIndex: 0,paraAddr:'',tradeAddr:''}] }, () => {})
      }else{
        chrome.storage.local.set({ 'parallelNodeList': [{index: 0,name:'gbttest',coin:"GBT",url:"http://114.55.11.139:1198",txHeight: -1, txIndex: 0,paraAddr:'',tradeAddr:''}] }, () => {})
<<<<<<< HEAD
        // chrome.storage.local.set({ 'parallelNodeList': [{index: 0, name: 'game', coin: "GBTY", url: "http://47.98.245.85:8901", txHeight: -1, txIndex: 0 ,paraAddr:'',tradeAddr:''}] }, () => {})
=======
>>>>>>> 19d23b8657c8aea01e26246c8ee2da1b7895da1c
      }
    })
    getChromeStorage('mainNode').then(res=>{
      if(res.mainNode){
        this.$store.commit('Account/UPDATE_CURRENT_MAIN', res.mainNode)
      }else{
        chrome.storage.local.set({ 'mainNode': {url: 'http://47.107.15.126:8801',name: 'user.p.gbttest.',index: 0,txHeight: -1, txIndex: 0, name: "BTY"} }, () => {})
      }
    })
    getChromeStorage('paraNode').then(res=>{
      if(res.paraNode){
        this.$store.commit('Account/UPDATE_CURRENT_PARALLEL', res.paraNode)
        // chrome.storage.local.set({ 'paraNode': {index: 0, name: 'game', coin: "GBTY", url: "http://47.98.245.85:8901", txHeight: -1, txIndex: 0 ,paraAddr:'',tradeAddr:''} }, () => {})
      }else{

        chrome.storage.local.set({ 'paraNode': {url: 'http://114.55.11.139:1198',index: 0, name: 'user.p.gbttest.', coin: "GBT",txHeight: -1, txIndex: 0,paraAddr:'',tradeAddr:''} }, () => {})
      }
    })
  }
}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  width: 400px;
  height: 600px;
}
#app {
  width: 400px;
  height: 600px;
  min-height: 600x;
  // background: #dfe7f3;
  background-image: url('../assets/images/indexBg.png');
  background-size: 100% 100%;
  box-sizing: border-box;
  /* 设置滚动条的样式 */
      &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
        background: transparent;
      }
      // /* 滚动槽 */
      // &::-webkit-scrollbar-track {
      // //   border-radius: $--border-radius-base;
      //   background: transparent;
      // }
      // /* 滚动条滑块 */
      &::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 0px;
        opacity: 0.2;
      }
}
</style>
