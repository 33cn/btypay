<template>
  <div id="app">
    <!-- <my-header></my-header> -->
    <router-view/>
  </div>
</template>
<script>
// import MyHeader from './Header'
import {eventBus} from '@/libs/eventBus'
export default {
  // components: {MyHeader},
  mounted() {
    eventBus.$on('node-change', (val) => {
      this.$chain33Sdk.httpProvider.setUrl(val) 
      eventBus.$emit('provider-changed')
    })
    window.chrome.storage.local.set({ 'mainNodeList': [{addr:'http://172.16.103.18:8801'}] }, () => {})
    window.chrome.storage.local.set({ 'parallelNode': [{name:'金比特',coin:"GBT",addr:"http://172.16.103.24:8801"}] }, () => {})
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
