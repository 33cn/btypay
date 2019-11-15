import parallelAPI from '@/mixins/parallelAPI.js'
import { getChromeStorage, setChromeStorage } from "@/libs/chromeUtil";
export default{
    mixins: [parallelAPI],
    methods: {
        // 跨链失败=>回滚
        chainRollBackHandle(){
            getChromeStorage("roolBack").then(res=>{
                console.log(res)
                if(res.roolBack){
                    let info = res.roolBack
                    if(info.operator == 'btyMain2Parallel' && info.step == 'two'){
                        this.btyMainRollBackTwo()
                    }else if(info.operator == 'btyMain2Parallel' && info.step == 'three'){
                        this.btyMainRollBackThree()
                    }
                    else if(info.operator == 'btyParallel2Main' && info.step == 'two'){
                        this.btyParallelRollBackTwo()
                    }
                    else if(info.operator == 'btyParallel2Main' && info.step == 'three'){
                        this.btyParallelRollBackThree()
                    }
                    else if(info.operator == 'ccnyMain2Parallel' && info.step == 'two'){
                        this.ccnyMainRollBackTwo()
                    }
                    else if(info.operator == 'ccnyMain2Parallel' && info.step == 'three'){
                        this.ccnyMainRollBackThree()
                    }
                    else if(info.operator == 'ccnyParallel2Main' && info.step == 'two'){
                        this.ccnyParallelRollBackTwo()
                    }
                    else if(info.operator == 'ccnyParallel2Main' && info.step == 'three'){
                        this.ccnyParallelRollBackThree()
                    }
                }
            })
        },
        // bty正向跨链失败=>回滚(步骤二error)
        btyMainRollBackTwo(){
            
        },
        // bty正向跨链失败=>回滚(步骤三)
        btyMainRollBackThree(){
            
        },
        // bty逆向跨链失败=>回滚(步骤二)
        btyParallelRollBackTwo(){
            
        },
        // bty逆向跨链失败=>回滚(步骤三)
        btyParallelRollBackThree(){
            
        },
        // ccny正向跨链失败=>回滚(步骤二)
        ccnyMainRollBackTwo(){
            
        },
        // ccny正向跨链失败=>回滚(步骤三)
        ccnyMainRollBackThree(){
            
        },
        // ccny逆向跨链失败=>回滚(步骤二)
        ccnyParallelRollBackTwo(){
            
        },
        // ccny逆向跨链失败=>回滚(步骤三)
        ccnyParallelRollBackThree(){
            
        },
    }
}