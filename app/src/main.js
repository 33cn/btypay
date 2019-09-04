import Vue from 'vue'
import App from './App/App'
import store from './store'
import router from './router'
import './assets/css/base.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {
  errNotify,
  sucNotify,
} from './libs/notification'
import SvgIcon from './components/SvgIcon'
import walletAPI from './mixins/walletAPI'
import BtyBaseSdk from '@33cn/chain33-rpc-api'
import('./libs/prototype')
Vue.config.productionTip = false
window.Long = true
Vue.config.Long = true

Vue.use(ElementUI)

Vue.use({
  install: (Vue) => {
    // 注入定制样式的消息提示
    Vue.prototype.$serverErrNotify = errNotify
    Vue.prototype.$serverSucNotify = sucNotify
    Vue.prototype.$chain33Sdk = new BtyBaseSdk('http://47.107.15.126:8801', (res) => {
      if (res.error === null) {
        return res.result
      } else {
        console.error(res.error)
        throw new Error(res.error)
      }
    })
    
  }
})

Vue.mixin({
  components: {
    SvgIcon
  }
})

Vue.mixin(walletAPI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
