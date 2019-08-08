<template>
    <div class="ImportOrCreate_container">
        <p>您是新用户吗?</p>
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
                    <img src="../../../assets/images/add.png" alt="">
                    <p class="btn">
                        <router-link :to="{ name: 'CreateWallet'}">创建钱包</router-link>
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {

}
</script>

<style lang='scss'>
.ImportOrCreate_container{
    >p{
        // height:30px;
        font-size:23px;
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
        color:rgba(245,185,71,1);
        margin: 0 0 32px 53.7px;
    }
    >ul{
        width: 304px;
        margin: 0 auto;
        li{
            p.desc{
                font-size:18px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(255,255,255,1);
                margin:  0 0px 13px 8px;
            }
            >div{
                width: 100%;
                height: 186px;
                background-image: url('../../../assets/images/importBg.png');
                background-size: 100% 100%;
                padding: 20px 0 0 0;
                display: flex;
                flex-direction: column;
                // justify-content: center;
                align-items: center;
                p{
                    width: 225px;
                    height: 43.5px;
                    background-image: url('../../../assets/images/importBtnBg.png');
                    background-size: 100% 100%;
                    text-align: center;
                    font-size:21px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    // padding-bottom: 8px;
                    a{
                        display: inline-block;
                        color:rgba(255,255,255,1)!important;
                        margin-top: 3px;
                    }
                }
                &.import{
                    img{
                        width: 63px;
                        height: 73px;
                        margin-bottom: 19px;
                    }
                }
                &.create{
                    padding: 33px 0 0 0;
                    img{
                        width: 53px;
                        height: 53px;
                        margin-bottom: 26px;
                    }
                }
            }
            &:nth-of-type(1){
                margin-bottom: 46px;
            }
        }
    }
}
</style>
