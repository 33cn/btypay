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
    // getChromeStorage('mainNodeList').then(res=>{
    //   if(res.mainNodeList && res.mainNodeList.length > 0){
    //     // this.$store.commit('Account/UPDATE_CURRENT_MAIN', res.mainNode)
    //     // chrome.storage.local.set({ 'mainNodeList': [{index: 0,url:'http://47.107.15.126:8801',txHeight: -1, txIndex: 0, name: "BTY" }] }, () => {})
    //   }else{
    //     chrome.storage.local.set({ 'mainNodeList': [{index: 0,url:'http://114.55.11.139:1193',txHeight: -1, txIndex: 0, name: "BTY" }] }, () => {})
    //     // console.log(this.$store.state.Account.mainNode)
    //   }
    // })
    // getChromeStorage('parallelNodeList').then(res=>{
    //   if(res.parallelNodeList && res.parallelNodeList.length > 0){
    //     // chrome.storage.local.set({ 'parallelNodeList': [{index: 0,name:'gbttest',coin:"GBT",url:"http://114.55.11.139:1198",txHeight: -1, txIndex: 0,paraAddr:'',tradeAddr:''}] }, () => {})
    //   }else{
    //     chrome.storage.local.set({ 'parallelNodeList': [{index: 0,name:'gameTest',coin:"GBTY",url:"http://114.55.11.139:1200",txHeight: -1, txIndex: 0,paraAddr:'',tradeAddr:''}] }, () => {})
    //     // chrome.storage.local.set({ 'parallelNodeList': [{index: 0, name: 'game', coin: "GBTY", url: "http://47.98.245.85:8901", txHeight: -1, txIndex: 0 ,paraAddr:'',tradeAddr:''}] }, () => {})
    //   }
    // })
    // getChromeStorage('DefaultMainNode').then(res=>{
    //   if(res.DefaultMainNode){
    //     this.$store.commit('Account/UPDATE_CURRENT_MAIN', res.DefaultMainNode)
    //   }else{
    //     setChromeStorage('DefaultMainNode',{url: 'http://114.55.11.139:1193',index: 0,txHeight: -1, txIndex: 0, name: "BTY"}).then(res=>{})
    //   }
    // })
    // getChromeStorage('DefaultParaNode').then(res=>{
    //   if(res.DefaultParaNode){
    //     this.$store.commit('Account/UPDATE_CURRENT_PARALLEL', res.DefaultParaNode)
    //   }else{
    //     setChromeStorage('DefaultParaNode',{ index: 0, name: 'gameTest', coin: "GBTY", url: "http://114.55.11.139:1200", txHeight: -1, txIndex: 0,paraAddr:'1HPkPopVe3ERfvaAgedDtJQ792taZFEHCe',tradeAddr:'1CCHJ6ng6G6KRXmVinhK32988wAZwkbg5' }).then(res=>{})
    //   }
    // })
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
