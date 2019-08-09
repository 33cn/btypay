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
      path:'/coin',
      name:'bty',
      component:() => import('./App/view/asset/Bty')
    },{
      path:'/coin/receipt',
      name:'receipt',
      component:() => import('./App/view/receipt/Receipt')
    },{
      path:'/coin/transfer',
      name:'transfer',
      component:() => import('./App/view/transfer/Transfer')
    },{
      path:'/coin/convert',
      name:'convert',
      component:() => import('./App/view/convert/Convert')
    },{
      path:'/coin/address',
      name:'address',
      component:() => import('./App/view/transfer/Address')
    },{
      path:'/coin/address/addAddress',
      name:'addAddress',
      component:() => import('./App/view/transfer/AddAddress')
    },{
      path:'/coin/detail/:id',
      name:'detail',
      component:() => import('./App/view/asset/record/Detail')
    },{
      path:'/coin/convertDetail/:id',
      name:'convertDetail',
      component:() => import('./App/view/asset/record/ConvertDetail')
    },
    {
      path: '*',
      redirect: 'ImportOrCreate'
    }
  ]
})
