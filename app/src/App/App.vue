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
      if(res.mainNodeList && res.mainNodeList.length > 0){}else{
        chrome.storage.local.set({ 'mainNodeList': [{url:'http://172.16.103.18:8801'}] }, () => {})
      }
    })
    getChromeStorage('parallelNodeList').then(res=>{
      if(res.parallelNodeList && res.parallelNodeList.length > 0){}else{
        chrome.storage.local.set({ 'parallelNodeList': [{name:'金比特',coin:"GBT",url:"http://172.16.103.24:8801"}] }, () => {})
      }
    })
    getChromeStorage('mainNode').then(res=>{
      if(res.mainNode){}else{
        chrome.storage.local.set({ 'mainNode': {url: 'http://172.16.103.18:8801'} }, () => {})
      }
    })
    getChromeStorage('paraNode').then(res=>{
      if(res.paraNode){}else{
        chrome.storage.local.set({ 'paraNode': {url: 'http://172.16.103.24:8801'} }, () => {})
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
}
</style>
