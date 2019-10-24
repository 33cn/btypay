// 再次打开钱包，恢复钱包关闭前的状态
import {getChromeStorage,setChromeStorage} from '@/libs/chromeUtil.js'
export default{
    data(){
        return{
            beforePath:{
                name:'',
                path:'',
                query:{},
                params:{}
            },
            element:{},
            fromPath:'',
            coin:''
        }
    },
    methods: {
        /**
         * 
         * @param {*} val 
         */
        getAndSet(key,value){
            getChromeStorage('element').then(res=>{
                console.log(res)
                res.element[key] = value
                setChromeStorage('element',res.element).then(res=>{
                    console.log(res)
                })
            })
        }
    },
    beforeRouteEnter(to, from, next){
        next(vm=>{
            vm.fromPath = from.path
            if(to.path=='/WordsShow' || to.path=='/WordsConfirm'){
                vm.beforePath.path = '/CreateWallet'
            }else{
                vm.beforePath.path = to.path
            }
            if((from.path=='/'&&to.path=='/ImportWallet')||(from.path=='/'&&to.path=='/CreateWallet')){
                // vm.beforePath.haveWallet = true
                vm.$store.commit('Records/PAGE_IS_CLOSE', false)
            }
            vm.beforePath.name = to.name
            vm.beforePath.query = to.query
            vm.beforePath.params = to.params
            // console.log(vm.beforePath)
            // vm.beforePath = to
            // console.log(vm.beforePath)
            setChromeStorage('beforePath',vm.beforePath).then(res=>{
                console.log(res)
            })
            if(vm.fromPath == '/'){
                getChromeStorage('element').then(res=>{
                    console.log(res)
                    let obj = res.element
                    for(let i in obj){
                        vm[i] = obj[i]
                    }
                })
            }else{
                setChromeStorage('element',{}).then(res=>{
                    console.log(res)
                })
            }
            next()
        })
      },
    watch: {
        beforePath(val){
            setChromeStorage('beforePath',val).then(res=>{
                console.log(res)
            })
        }
    },
    mounted () {
        // console.log(this.fromPath)
        // if(this.fromPath == '/'){
        //     getChromeStorage('element').then(res=>{
        //         console.log(res)
        //         let obj = res.element
        //         for(let i in obj){
        //             this[i] = obj[i]
        //         }
        //     })
        // }else{
        //     setChromeStorage('element',{}).then(res=>{
        //         console.log(res)
        //     })
        // }
        // setChromeStorage('beforePath',this.beforePath).then(res=>{
        //     console.log(res)
        // })
        getChromeStorage('currentPageCoin').then(res=>{
            if(!this.coin){
                this.coin = res.currentPageCoin
            }
        })
    }
}