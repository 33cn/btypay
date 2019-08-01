import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path:'/',
      component: () => import('./App/view/home/Index'),
      children:[
        {
          path:'',
          name:'ImportOrCreate',
          component:() => import('./App/view/home/ImportOrCreate')
        },
        {
          path:'ImportWallet',
          name:'ImportWallet',
          component:() => import('./App/view/home/ImportWallet')
        },
        {
          path:'CreateWallet',
          name:'CreateWallet',
          component:() => import('./App/view/home/CreateWallet')
        },
        {
          path:'WordsShow',
          name:'WordsShow',
          component:() => import('./App/view/home/WordsShow')
        },
        {
          path:'WordsConfirm',
          name:'WordsConfirm',
          component:() => import('./App/view/home/WordsConfirm')
        }
      ]
    },{
      path:'/WalletIndex',
      name:'WalletIndex',
      component:() => import('./App/view/asset/WalletIndex')
    },{
      path:'/node',
      name:'node',
      component:() => import('./App/view/node/Node')
    },{
      path:'/bty',
      name:'bty',
      component:() => import('./App/view/asset/Bty')
    },{
      path:'/bty/receipt',
      name:'receipt',
      component:() => import('./App/view/receipt/Receipt')
    },{
      path:'/bty/transfer',
      name:'transfer',
      component:() => import('./App/view/transfer/Transfer')
    },{
      path:'/bty/convert',
      name:'convert',
      component:() => import('./App/view/convert/Convert')
    },{
      path:'/bty/address',
      name:'address',
      component:() => import('./App/view/transfer/Address')
    },{
      path:'/bty/address/addAddress',
      name:'addAddress',
      component:() => import('./App/view/transfer/AddAddress')
    },{
      path:'/bty/detail/:id',
      name:'detail',
      component:() => import('./App/view/asset/record/Detail')
    },
    {
      path: '*',
      redirect: 'ImportOrCreate'
    }
  ]
})
