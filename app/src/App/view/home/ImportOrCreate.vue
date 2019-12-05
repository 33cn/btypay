<template>
    <div class="ImportOrCreate_container">
        <p @click="tesst">您是新用户吗?</p>
        <ul>
            <li>
                <p class="desc">不是，我已经有比特元钱包了。</p>
                <div class="import">
                    <img src="../../../assets/images/down.png" alt="">
                    <p class="btn">
                        <router-link :to="{ name: 'ImportWallet'}">导入钱包</router-link>
                    </p>
                </div>
            </li>
            <li>
                <p class="desc">是，让我们赶紧开始吧。</p>
                <div class="create">
                    <img src="../../../assets/images/adds.png" alt="">
                    <p class="btn">
                        <router-link :to="{ name: 'CreateWallet'}">创建钱包</router-link>
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import {setChromeStorage,getChromeStorage} from '@/libs/chromeUtil.js'
export default {
    methods:{
        tesst(){
           setChromeStorage("AccountList", [] ).then(res=>{})
        }
    },
    mounted(){
        console.log('ImportOrCreate')
        setChromeStorage('beforePath',{}).then(res=>{
            // console.log(res)
        })
        setChromeStorage('element',{}).then(res=>{
            // console.log(res)
        })
        getChromeStorage("AccountList").then(res=>{
            if(!res.AccountList){
                setChromeStorage("AccountList",[]).then(res=>{})
            }else{
                if(!res.AccountList.length){
                    setChromeStorage("AccountList",[]).then(res=>{})
                }
            }
        })
    }
}
</script>

<style lang='scss'>
.ImportOrCreate_container{
    >p{
        // height:30px;
        font-size:18px;
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
        color:rgba(245,185,71,1);
        margin: 0 0 31px 67px;
    }
    >ul{
        width: 278px; 
        margin: 0 auto;
        li{
            p.desc{
                font-size:16px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(255,255,255,1);
                margin:  0 0px 10px 7px;
            }
            >div{
                width: 100%;
                height: 146px;
                // background-image: url('../../../assets/images/importBg.png');
                // background-size: 100% 100%;
                background-color: #fff;
                border-radius: 10px;
                padding: 20px 0 0 0;
                display: flex;
                flex-direction: column;
                // justify-content: center;
                align-items: center;
                p{
                    width: 178px;
                    height: 66px;
                    background-image: url('../../../assets/images/loginBtn.png');
                    background-size: 100% 100%;
                    text-align: center;
                    font-size:14px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    // padding-bottom: 8px;
                    a{
                        width: 100%;
                        // height: 100%;
                        height: 34px;
                        display: inline-block;
                        color:rgba(255,255,255,1)!important;
                        margin-top: 8px;
                    }
                }
                &.import{
                    img{
                        width: 44px;
                        height: 50px;
                        margin-bottom: 26px;
                    }
                }
                &.create{
                    height: 144px;
                    padding-top: 18px;
                    img{
                        width: 47px;
                        height: 47px;
                        margin-bottom: 26px;
                    }
                }
            }
            &:nth-of-type(1){
                margin-bottom: 36px;
            }
        }
    }
}
</style>
